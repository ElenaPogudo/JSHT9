const argv = require('yargs').argv;
const fs = require('fs');
const pathToReport = argv.path;
const htmlPage = require('./HTMLschema');
const reportJson = JSON.parse(fs.readFileSync(pathToReport));

function generateMainBoard(json) {
    let mainBoard = '';
    let numberOfSkipped = 0;
    let numberOfPassed = 0;
    let numberOfFailed = 0;
    json.forEach((feature) => {
        feature.elements.forEach((scenario) => {
            scenario.steps.forEach((step)=>{
                switch(step.result.status){
                    case "passed" :numberOfPassed++;break;
                    case "failed" :numberOfFailed++;break;
                    case "skipped" : numberOfSkipped++;break;
                }
            })
        })
    });
    mainBoard += `
    <td><span class="text skipped"><span class="keyword highlight">Skipped: ${numberOfSkipped}</span></span></td>
    <td><span class="text passed"><span class="keyword highlight">Passed: ${numberOfPassed}</span></span></td>
    <td><span class="text failed"><span class="keyword highlight">Failed: ${numberOfFailed}</span></span></td>
    `;
    return mainBoard
}

function generateSteps(stepsArray, scenarioName) {
    let stepsHtml = '';
    let stepDuration = 0;
    stepsArray.forEach((step) => {
        if (step.keyword !== 'After') {
            if (step.result.duration !== undefined) {
                stepDuration = step.result.duration / 1000
            }
            else {
                stepDuration = 0
            }
            stepsHtml += `<div class="step"><p><span class="text ${step.result.status}">
                <span class="keyword highlight"> ${step.keyword} </span> ${step.name}`
            ;
            if (step.result.status === "failed") {
                stepsHtml += `<br><br><span class="step"><span class="keyword highlight">Error: </span>${step.result.error_message}</span>`
            }
            stepsHtml += `<span class="time">time:${stepDuration}s</span></span></p></div>`
        }
        else {
            if (step.embeddings !== undefined) {
                let image = new Buffer.from(step.embeddings[0].data, 'base64');
                fs.existsSync('screenshots') || fs.mkdirSync('screenshots');
                let screenshotPath = './screenshots/' + scenarioName.replace(/\s/g, '') + '.png';
                fs.writeFileSync(screenshotPath, image, 'base64');
                stepsHtml += `<span class="keyword highlight">
                   <a class ="toggle" href="#">Screenshot -</a>
                   <a class ="screenshot" href="${screenshotPath}">
                    <img class="screenshot" style="height:100%;width:98%" id="my_image" src='${screenshotPath}'>
                   </a>
`;
            }
        }

    });
    return stepsHtml;
}

function scenarioTime(scenario) {
    let time = 0;

    scenario.steps.forEach((step) => {
        if (step.result.duration !== undefined) {
            time += step.result.duration;
        }
    });
    return time / 1000;
}

function featureTime(features) {
    let time = 0;
    features.forEach((feature) => {
        feature.elements.forEach((scenario) => {
            time += scenarioTime(scenario);
        });
    });

    return time
}

function generateScenario(scenarioArray, featureIndex,) {
    let scenarioHtml = '';
    let scenarioIndex = 0;

    scenarioArray.forEach((scenario) => {
        scenarioHtml += `<div class="elementBlock"  >
        <h3 class="title" type="button" data-toggle="collapse" data-target="#feature${featureIndex}scenario${scenarioIndex}">
        <span class="highlight">Scenario: </span>${scenario.name}
    <span class="time">time:${scenarioTime(scenario)}s</span></h3>
    <div id="feature${featureIndex}scenario${scenarioIndex}" class="collapse">${generateSteps(scenario.steps, scenario.name)}</div></div>`;
        scenarioIndex++;
    });
    return scenarioHtml;
}

function generateFeatures(jsonData) {
    let reportFillingHtml = '';
    let featureIndex = 0;
    jsonData.forEach((feature) => {
        feature.Steps = ``;
        reportFillingHtml += `<button type="button" class="btn btn-dark btn-block" data-toggle="collapse" data-target="#feature${featureIndex}">
            <span class="highlight">Feature: </span>
            ${feature.name}<span class="time">time:${featureTime(jsonData)}s</span></h1></button>
            <div id="feature${featureIndex}" class="collapse">${generateScenario(feature.elements, featureIndex)}</div></div>
`;
        featureIndex++;
    });
    return reportFillingHtml;
}

let finalHtml = htmlPage.header +htmlPage.startOfMain+ generateMainBoard(reportJson)+ htmlPage.endOfMain+ generateFeatures(reportJson) + htmlPage.end;
fs.writeFileSync('report.html', finalHtml.toString(), 'utf8');