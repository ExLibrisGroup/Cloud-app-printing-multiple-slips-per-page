export class Constants {
	deleteTip =  "Delete selected template";
	saveTip =  "Save template";
	editTip =  "Edit an existing template";
	openTip = "Create new template based on an existing one";
    public static HTML_FILES = [
		{ id: '1 slip per line.html', name: 'Standard 1 per line format'},
		{ id: '2 slips per line.html', name: 'Standard 2 per line format'},
		{ id: '3 slips per line.html', name: 'Standard 3 per line format'},
		{ id: '4 slips per line.html', name: 'Standard 4 per line format'}
      ]; 
    static SAMPLE_LETTER: string = `<html>
	<head>
	<META http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<style> body {direction:ltr; background-color:#fff} .listing td {border-bottom: 1px solid #eee} .listing tr:hover td {background-color:#eee} .listing th {background-color:#f5f5f5 } h4{line-height: 0.2em} </style>
	</head>
	<body>
	<h1>
	<b>Requested For :
	Smith, John</b>
	</h1>
	<table cellspacing="0" cellpadding="5" border="0" style="background-color:#e9e9e9; width:100%; height:30px; text-shadow:1px 1px 1px #fff;">
	<tr style="background-color:#ffffff; width:100%;">
	<td colspan="2">
	<div id="mailHeader">
	<div id="logoContainer" class="alignLeft">
	<img src="/../assets/logo-main.png">
	
	</div>
	</div>
	</td>
	</tr>
	<tr>
	<td>
	<h1>Letter Name</h1>
	</td><td align="right">18/11/2019</td>
	</tr>
	</table>
	<div class="messageArea">
	<div class="messageBody">
	<table cellspacing="0" cellpadding="5" border="0">
	<tr>
	<td><b>Requested For: </b>Smith, John</td>
	</tr>
	<tr>
	<td>
	<div class="recordTitle">
	<span class="spacer_after_1em"></span>
	</div>
	</td>
	</tr>
	<b></b>
	<tr>
	<td>
	<h2>
	<b>Location: </b>
	</h2>
	</td>
	</tr>
	<b></b>
	<tr>
	<td><b>Destination: </b>Law Library</td>
	</tr>
	<tr>
	<td><b>Request Type: </b>Patron physical item request</td>
	</tr>
	<tr>
	<td><b>Request Note:</b>Chapter 3-4</td>
	</tr>
	</table>
	</div>
	</div>
	<table style="background-color:#444; width:100%; text-shadow:1px 1px 1px #333; color:#fff; margin-top:1em; font-weight:700; line-height:2em; font-size:150%;">
	<tr style="list-style: none; margin:0 0 0 1em; padding:0">
	<td align="center">Main College&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
	</tr>
	</table>
	</body>
	</html>
	`
	static HTML_BODY = `<body>
							<div class="row">
								<div class="letter">${Constants.SAMPLE_LETTER}</div>
								<div class="letter">${Constants.SAMPLE_LETTER}</div>
								<div class="letter">${Constants.SAMPLE_LETTER}</div>
								<div class="letter">${Constants.SAMPLE_LETTER}</div>
								<div class="letter">${Constants.SAMPLE_LETTER}</div>
							</div>
				  		</body>` 
 }