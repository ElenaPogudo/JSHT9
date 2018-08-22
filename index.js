const argv = require('yargs').argv;
const fs = require('fs');
const pathToReport = argv.path;

const reportEnd = `</body></html>`;
const reportJson = JSON.parse(fs.readFileSync(pathToReport));
const reportHeader = `<!DOCTYPE html>
<html>
<head>
<title>Cucumber Feature Report by Alena Pahuda</title>
                        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
                        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
                        
<style type="text/css">
    body {
    font: 14px Consolas, Courier, monospace;
}
h1, h2, h3, h4, p {
    margin: 0;
    padding: 0;
}

.elementBlock{
margin: 1%;
background: #817f7c;
  padding: 5px;
  border-radius: 5px;
}


.time{
color: #000000;
    font-weight: 900;
    float: right;
}

.highlight {
    color: #111111;
    font-weight: bold;
}
.failed {
    background-color: #ffa3ad;
}
.passed {
    background-color: #ccffb4;
}
.skipped {
	background-color: #fff1a0;
}
.step {
    margin: 10px;
}
.step .text {
    border-radius: 3px;
    color: #666666;
    padding: 5px;
    display: block;
}
.btn {
font-size: 250%;
    background: #a7a5a1;
    border-radius: 5px;
    border: 1px solid #e8e8e8;
    padding: 10px;
    margin: 10px;
}
</style>

<meta charset="UTF-8">
    </head>
    <body >
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script>
    $(document).ready(function() {
        $('a.toggle').on('click', function() {
            if ($(this).text() === 'Screenshot -') {
                $(this).text('Screenshot +');
                $(this).siblings('a.screenshot').find('img').hide();
            } else {
                $(this).text('Screenshot -');
                $(this).siblings('a.screenshot').find('img').show();
            }
        });
    });
</script>`;


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
                <span class="keyword highlight"> ${step.keyword} </span> ${step.name} 
                <span class="time">time:${stepDuration}s</span></span></p></div>`;
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

let finalHtml = reportHeader + generateFeatures(reportJson) + reportEnd;
fs.writeFileSync('report.html', finalHtml.toString(), 'utf8');