# Cloud-app-printing-multiple-slips-per-page

<p>The App uses CSS template to print multiple slips in different styles.</p>
<p>It has 4 built-in CSSs and supports adding, editing and deleting custom CSS templates.</p>
<p>Under Settings you can select one of the templates.</p>
<p>Under Configuration (available for Admin users) - you can create a custom template. Use the folder button to open a template as a starting point, provide a name and save.</p>
<p>To report a problem, please open an issue by clicking on the link below.</p>
<p><a translate href="https://github.com/ExLibrisGroup/Cloud-app-printing-multiple-slips-per-page/issues" target="_blank">Open an issue</a></p>

# How to use

You should start your own templates by choosing one of the built-in CSSs, For example "Standard 2 per line format" showen below:


.row {
	
	display: grid;
	
	grid-template-columns: 49% 49%;
	
}
<p>.letter {
	
	border: 1px solid rgba(0, 0, 0, 0.1);
	
	padding: 5px;
	
	word-break: break-word;
	
}</p>
<p>@media print {
	
	.row {
	
		break-inside: avoid;
	
	}
}</p>
<p>Class "row" defines how many slips would be in each row by using grid.</p>
<p>Class "letter" is styling the letter.</p>



 
