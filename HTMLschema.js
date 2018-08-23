'use strict';

module.exports = {

    header: `<!DOCTYPE html><html>
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
  background-color: #ff9ca6;
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
  </script>`,


    startOfMain: `<br><br>
<h2 class="step"><p><table>
        <tr>
        <td><span class="keyword highlight step">Main info:</span></td>`,


    endOfMain: `</tr>
    </table>
    </br></h2>`,

    end: "</body></html>"
};