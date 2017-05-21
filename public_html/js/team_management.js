/*
FEXCO Team Management Library
Version: 1.0
Author: 
Date: 2014-10-02
Description:
This library is a centralised JavaScript Library to be include on Forms that want to populate drop down lists 
from a centralised Team Management form.

Central Form : 262 - System - Team Management
This library must be included in the form in the Campaign - JavaScript - onLoad area of the Advanced Settings.

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Setup

Main Menu > Form Management > Form - Primary Management > Form - Advanced Settings > Select your form > Instructions > Opening Instructions

<div id='divHistory'></div>
<script language='javascript' type='text/javascript' src='https://ww3.allnone.ie/client/client_fexco/custom/FEXCO_TeamManagement.js' ></script>


Main Menu > Form Management > Form - Primary Management > Form - Advanced Settings > Select your form > JavaScript onLoad > onLoad

var strQA_TLField = 'strCDA_263_field_0_16';
var strQA_MemberField = 'strCDA_263_field_0_1';
fn_TeamMember_Main();


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Global Variables
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var strHistory 				= 'divHistory';							// The name of the field for errors and system messages
var divHistory 				= document.getElementById(strHistory); 	// The field into which to put error messages
var intTM_System 			= 'client_fexco'; 						// The system where this library is being used
var intTM_SourceForm 		= '262'; 								// The field which contains the Team Member listing
var intTM_SourceTLead 		= 'strCDA_262_field_0_1'; 				// The field which contains the Team Lead Id
var intTM_SourceTMember 	= 'strCDA_262_field_0_2'; 				// The field which contains the Team Member Id
var intTM_SourceAssessor 	= 'strCDA_262_field_0_3';				// The field which contains the Assessor for this person
var intTM_SourceContact 	= 'strCDA_262_field_0_4';				// The field which contains the Contract for this person



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Testing Function
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fn_TestingInline(strFieldName){
	if(document.getElementById('intSystemGenerated_UserId')){
		if(document.getElementById('intSystemGenerated_UserId').value == '37'){
			alert(strFieldName);
		}
	}
}

function fn_TestingInline_Execute(){
	if(document.getElementById('intSystemGenerated_UserId')){
		if(document.getElementById('intSystemGenerated_UserId').value == '37'){
			return true;
		}
		else{
			return false;
		}
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fn_CentralManagement_AJAX_SelectItem ( strFieldName, intId ) {
      if (typeof aryAjax_Settings=="undefined")
            alert("Library did not load");
      else {
		  	aryAjax_Settings[7] = '';
            aryAjax_Settings[0] = intTM_System; 				// Your system name
            aryAjax_Settings[3] = intTM_SourceForm; 			// The form which contains the team member list
            aryAjax_Settings[4] = intTM_SourceTMember;      	// The field which contains the limiting / grouping factor
            aryAjax_Settings[5] = intId; 						// The value to limit the responses by
            aryAjax_Settings[13] = -1; 							// Limit responses -1 do not limit
            aryAjax_Settings[14] = "false"; 					// Draw a table

            aryAjax_Settings[15] = divHistory; 					// Where to draw error messages if any
            aryAjax_Settings[16] = "Insert"; 					// Engine to use i.e. Populate
            aryAjax_Settings[6] = intTM_SourceTLead;  		    // The field in the team member form to insert into the chosen field
            aryAjax_Settings[17] = strFieldName;    			// The field in the current form into which the results will be inserted
 						
 			//Use my login to allow me to search
			aryAjax_Settings[22] = document.getElementById('intSystemGenerated_CompanyId').value; 	//Auto Login - System
			aryAjax_Settings[23] = document.getElementById('intSystemGenerated_UserId').value; 		//Auto Login - User
			aryAjax_Settings[24] = document.getElementById('intSystemGenerated_LoginKey').value; 	//Auto Login - SessionId
			aryAjax_Settings[28] = "";

			fn_Ajax_BE_Process();
      }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fn_CentralManagement_AJAX_LimitList ( strFieldName, intId ) {

      if (typeof aryAjax_Settings=="undefined")
            alert("Library did not load");
      else {
            aryAjax_Settings[0] = intTM_System; 				// Your system name
            aryAjax_Settings[3] = intTM_SourceForm; 			// The form which contains the team member list
            aryAjax_Settings[4] = intTM_SourceAssessor;      	// The field which contains the limiting / grouping factor
            aryAjax_Settings[5] = intId; 						// The value to limit the responses by, in this case only yes items
            aryAjax_Settings[13] = -1; 							// Limit responses -1 do not limit
            aryAjax_Settings[14] = "false"; 					// Draw a table

            aryAjax_Settings[15] = divHistory; 					// Where to draw error messages if any
            aryAjax_Settings[16] = "Append"; 					// Engine to use i.e. Populate
            aryAjax_Settings[6] = intTM_SourceTMember;  	    // The field in the team member form to insert into the chosen field
            aryAjax_Settings[17] = strFieldName;    			// The field in the current form into which the results will be inserted
 
 			//Use my login to allow me to search
			aryAjax_Settings[22] = document.getElementById('intSystemGenerated_CompanyId').value; 	//Auto Login - System
			aryAjax_Settings[23] = document.getElementById('intSystemGenerated_UserId').value; 		//Auto Login - User
			aryAjax_Settings[24] = document.getElementById('intSystemGenerated_LoginKey').value; 	//Auto Login - SessionId
 			aryAjax_Settings[28] = "fn_CentralManagement_PopulatePersonFromList ('" + strFieldName + "')";
			fn_Ajax_BE_Process();
      }
	
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fn_CentralManagement_Engine ( strFieldName, intMember, strOption ){

	var strErrors = '';
	var strValues = '';
	var aryValues;
	var intCount = 0;
	var objAllStaff = document.getElementById(strQA_TLField);
	
	//fn_TestingInline('strFieldName: ' + strFieldName);
	//fn_TestingInline('intMember: ' + intMember);
	//fn_TestingInline('strOption: ' + strOption);
	//Step 1. Lets make sure we have somewhere to put the data, otherwise error it out.
	if (document.getElementById(strFieldName)){
	
		//Step 2.  Make sure we have a valid number to work with
		intMember = +intMember;
		if ( intMember > 0 ) {
			
			//Step 3. Wipe the current Team Leader List
			document.getElementById(strFieldName).value = '';
			
			if ( strOption == 'SelectItem' ){
				//Step 4. Use the AJAX function, now we are sure we have vaild details
				fn_CentralManagement_AJAX_SelectItem ( strFieldName, intMember );
			}
//			else if ( strOption == 'LimitList' ){
//				
//				//Step 5-1. Get all the values into a text box.
//				fn_CentralManagement_AJAX_LimitList ( strFieldName, intMember );
//				
//			}
			else {
				strErrors += "Option not managed.<br />";
			}
		}
		else {
			strErrors += "No valid id passed to look up.<br />";
		}
	}
	else {
		strErrors += "List to populate not found.<br />";
	}
	
	//Finally if we have errors and somewhere to put them...
	//Otherwise we pop them as an alert
	if (divHistory){
		if (strErrors.length > 0){
			divHistory.innerHTML = strErrors;
		}
	}
	else{
		if (strErrors.length > 0){
			alert (strErrors);
		}
	}
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fn_CentralManagement_DelayedPopulate(strFieldName, objAllStaff){
	
	var strValues = '';
	var aryValues;
	var intValue;
	var intCount = 0;
	
	//Step 5-3. Load the values
	while ((strValues == '') && (intCount < 20)){
		strValues = document.getElementById(strFieldName).value;
		intCount = intCount + 1;
	}

	//Step 5-4. Create the array from the items
	if (strValues == ''){
	}
	else {
		//Split the items
		aryValues = strValues.split(", ")
		if (aryValues instanceof Array) {
			//For all the members listed
			for (var i = 0; i < aryValues.length; i++){
				intValue = parseInt(aryValues[i]);
				if ( intValue > 0 ){
					for (var j = 0; j < objAllStaff.length; j++){
						if ( parseInt(objAllStaff.options[j].value) == intValue ){
							fn_Gen_List_Add ( strQA_MemberField, objAllStaff.options[j].text, objAllStaff.options[j].value );
						}
					}
				}
			}
		}
	}
	
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fn_CentralManagement_PopulatePersonFromList (strFieldName){
	
	var objAllStaff = document.getElementById(strQA_TLField);
	//Step 5-2. First thing we do is wipe the Person list
	fn_Gen_List_Clear ( strQA_MemberField );
	fn_Gen_List_Add ( strQA_MemberField, '', '' );
	fn_CentralManagement_DelayedPopulate(strFieldName, objAllStaff);
	
	// * Generic Drop Down list Sort Function
	fn_General_SortDropDownListCustom ( 'strCDA_' + intCampaign_Id + '_field_0_1', true, false, true );
	
	if (document.getElementById(('strCDA_'+ intCampaign_Id +'_field_0_169') )){
	
		fn_General_SortDropDownListCustom ( 'strCDA_' + intCampaign_Id + '_field_0_169', true, false, true );
		
		document.getElementById('strCDA_'+ intCampaign_Id +'_field_0_169').onchange = function(){
			setTimeout(function(){
			fn_Retrieve_Client();},5000);
		};
			
	}
	
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fn_CentralManagement_AJAX_LimitByContract ( strFieldName, strLimitingValue ) {

      if (typeof aryAjax_Settings=="undefined")
            alert("Library did not load");
      else {
            aryAjax_Settings[0] = intTM_System; 				// Your system name
            aryAjax_Settings[3] = intTM_SourceForm; 			// The form which contains the team member list
            aryAjax_Settings[4] = intTM_SourceContact;      	// The field which contains the limiting / grouping factor
            aryAjax_Settings[5] = strLimitingValue; 			// The value to limit the responses by, in this case the contract name
            aryAjax_Settings[13] = -1; 							// Limit responses -1 do not limit
            aryAjax_Settings[14] = "false"; 					// Draw a table

            aryAjax_Settings[15] = divHistory; 					// Where to draw error messages if any
            aryAjax_Settings[16] = "Append"; 					// Engine to use i.e. Populate
            aryAjax_Settings[6] = intTM_SourceTMember;  	    // The field in the team member form to insert into the chosen field
            aryAjax_Settings[17] = strFieldName;    			// The field in the current form into which the results will be inserted	
						
 			//Use my login to allow me to search
			aryAjax_Settings[22] = document.getElementById('intSystemGenerated_CompanyId').value; 	//Auto Login - System
			aryAjax_Settings[23] = document.getElementById('intSystemGenerated_UserId').value; 		//Auto Login - User
			aryAjax_Settings[24] = document.getElementById('intSystemGenerated_LoginKey').value; 	//Auto Login - SessionId
 			aryAjax_Settings[28] = "fn_CentralManagement_PopulatePersonFromList ('" + strFieldName + "')";
			fn_Ajax_BE_Process();
      }
	
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fn_onChange_AddToPerson() {
	
	var element = document.getElementById(strQA_MemberField);
	if (element){
		if(element.addEventListener){
		  element.addEventListener("change", function(e){
			e = e || event;
			fn_CentralManagement_Engine ( strQA_TLField, document.getElementById(strQA_MemberField).value, 'SelectItem' );
			setTimeout( function (){
				if (objDisplay_TeamLead){
					objDisplay_TeamLead.value = document.getElementById(strQA_TLField).value;
				}
				if (objHidden_TeamLead){
					objHidden_TeamLead.value = document.getElementById(strQA_TLField).value;
				}
			}, 750);
		  }, false);
		}
		else if(element.attachEvent){
		  element.attachEvent("onchange", function(e){
			e = e || event;
			fn_CentralManagement_Engine ( strQA_TLField, document.getElementById(strQA_MemberField).value, 'SelectItem' );
			setTimeout( function (){
				if (objDisplay_TeamLead){
					objDisplay_TeamLead.value = document.getElementById(strQA_TLField).value;
				}
				if (objHidden_TeamLead){
					objHidden_TeamLead.value = document.getElementById(strQA_TLField).value;
				}
			}, 750);
		  });
		}
	}
	else {
		alert ('onChange Field not found [' + strQA_MemberField + ']');	
	}
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fn_onChange_AddToAssessor() {
	var element = document.getElementById(strQA_AssessorField);
	if (element){
		if(element.addEventListener){
		  element.addEventListener("change", function(e){
			e = e || event;
			fn_CentralManagement_Engine ( strQA_AssessorMembers, document.getElementById(strQA_AssessorField).value, 'LimitList' );
		  }, false);
		}
		else if(element.attachEvent){
		  element.attachEvent("onchange", function(e){
			e = e || event;
			fn_CentralManagement_Engine ( strQA_AssessorMembers, document.getElementById(strQA_AssessorField).value, 'LimitList' );
		  });
		}
	}
	else {
		alert ('onChange Field not found [' + strQA_MemberField + ']');	
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fn_Call_All_OnChange_OnLoad(){
	//fn_Fexco_CopySelection_List1_To_List2('selectTeamLeader', 		'strCDA_' + intCampaign_Id + '_field_0_97');
	fn_Fexco_CopySelection_List1_To_List2('selectContract', 		'strCDA_' + intCampaign_Id + '_field_0_98');	
	fn_Fexco_CopySelection_List1_To_List2('selectContact_Type', 	'strCDA_' + intCampaign_Id + '_field_0_99');
	fn_Fexco_CopySelection_List1_To_List2('selectCall_Type', 		'strCDA_' + intCampaign_Id + '_field_0_100');
	fn_Fexco_CopySelection_List1_To_List2('selectSubCall_Type', 	'strCDA_' + intCampaign_Id + '_field_0_101');
	document.getElementById('strCDA_' + intCampaign_Id + '_field_0_102').value = document.getElementById('strCall_Duration').value;
	
	if( document.getElementById('btn_reset') ){
		document.getElementById('btn_reset').style.display					= 'none';
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fn_TeamMember_Main (){
	//alert('Main Start');
	//Firstly we need to add to the onChange of the Person field to dynamically look up the Team Lead
	fn_onChange_AddToPerson();
	//fn_onChange_AddToAssessor();
	fn_Call_All_OnChange_OnLoad();
	//alert('Main End');

}
