function NewSupplier(pageUrl) {
  var options = {
    url: pageUrl,
    title: "Supplier Evaluation Form",
    allowMaximize: false,
    showClose: true,
    height: 420,
  };
  SP.SOD.execute(
    "sp.ui.dialog.js",
    "SP.UI.ModalDialog.showModalDialog",
    options
  );
}

function SupplierRisksForm() {
  console.log("SupplierRisksForm Script Found");
  const Form = {
    VendorId: document.getElementById(
      "Title_fa564e0f-0c70-4ab9-b863-0177e6ddd247_$TextField"
    ),
    Supplier: document.getElementById(
      "Supplier_72cef0ff-20fc-4713-9519-930525ce1877_$TextField"
    ),
    SupplierSince: document.getElementById(
      "SupplierSince_329a5b9f-30fe-4447-906e-b5cd99558b2c_$DateTimeFieldDate"
    ),
    GMN: document.getElementById(
      "GMN_8babd2d8-8a60-494d-bc95-c3a961fa6f48_$TextField"
    ),
    Description: document.getElementById(
      "Material_x0020_Description_76c35ec7-709b-4447-8652-ba27fa0986a0_$TextField"
    ),
    VendorStatus: document.getElementById(
      "Status_fd13e8fb-2c8f-459f-a9b4-be5103d8eb7d_$DropDownChoice"
    ),
    LastAssessment: document.getElementById(
      "LastAssessment_9ca4fa29-86e7-4b9d-9991-fbcd27e19a40_$DateTimeFieldDate"
    ),
    ProductCertification: document.getElementById(
      "PCertification_1155cb01-9d3e-42df-9368-771a0a9ad73b_$DropDownChoice"
    ),
    VendorCertification: document.getElementById(
      "VCertification_264aa549-d43d-4f6f-8efb-da8d2b3a78f5_$DropDownChoice"
    ),
    Application: document.getElementById(
      "Application_3dc6d7b2-4c4f-4ba9-9df4-edeeba611188_$DropDownChoice"
    ),
    FPRisk: document.getElementById(
      "FPRisk_79646ecc-5c3d-43bd-a36c-6837044d7321_$DropDownChoice"
    ),
    RQRisk: document.getElementById(
      "RQRisk_33415635-c6d2-4a6e-86f1-def4fb586421_$DropDownChoice"
    ),
    QA: document.getElementById(
      "QA_x0020_Responsible_7c126910-94cb-4e48-bdd2-c9dfb817b4cb_$ClientPeoplePicker"
    ),
    AuditPlan: document.getElementById(
      "AuditPlan_47697c95-a6b1-46bd-8a5d-944113f3e4e3_$DropDownChoice"
    ),
    RiskScore: document.getElementById(
      "RiskScore_c3981730-50a2-4264-824f-3a4f231c34b2_$NumberField"
    ),
    NoAuditRequired: document.getElementById(
      "NotRequired_9e379de5-83c6-4dae-9d6a-868553256618_$BooleanField"
    ),
    ReasonNotRequired: document.getElementById(
      "ReasonNotRequired_d0f12ad1-22aa-4c7e-a177-79d8808f4b9d_$TextField"
    ),
    Inactive: document.getElementById(
      "Inactive_81442532-a97b-4808-99e6-e9bd626112ac_$BooleanField"
    ),
    Attachment: document.getElementById(
      "Ribbon.ListForm.Edit.Actions.AttachFile-Large"
    ),
    SaveButton: document.getElementById(
      "ctl00_ctl33_g_6584409f_3f8b_47d8_b868_43aa7fab2147_ctl00_toolBarTbl_RightRptControls_ctl00_ctl00_diidIOSaveItem"
    ),
    FormType: "Edit",
  };
  // CHECK WHETHER NEW OR EDIT FORM
  if (Form.SaveButton === null) {
    Form.SaveButton = document.getElementById(
      "ctl00_ctl33_g_6123c34a_d464_4cd1_ab50_953b19221098_ctl00_toolBarTbl_RightRptControls_ctl00_ctl00_diidIOSaveItem"
    );
    Form.FormType = "New";
  }
  FormStyling(Form);
  if (Form.FormType == "Edit") {
    FormView(Form, "Risks");
  } else {
    FormView(Form, "Info");
  }
  if (!IEBrowser()) {
    CalculateScore(Form);
  }
  // REMOVE LOADER
  document.getElementById("Loader").style.display = "none";
  document.getElementById("MSOZoneCell_WebPartWPQ4").style.display =
    "inline-table";
  document.getElementById("MSOZoneCell_WebPartWPQ4").style.opacity = 1;

  // ADD EVENT LISTENERS FOR ALL EVALUTATION INPUTS
  Form.Supplier.addEventListener("input", function () {
    ForceUppercase(this);
  });
  Form.GMN.addEventListener("input", function () {
    ForceUppercase(this);
  });
  Form.Description.addEventListener("input", function () {
    ForceUppercase(this);
  });
  Form.Application.addEventListener("change", function () {
    MarkNotRequired(Form);
  });
  if (!IEBrowser()) {
    Form.LastAssessment.addEventListener("change", function () {
      CalculateScore(Form);
    });
    Form.ProductCertification.addEventListener("change", function () {
      CalculateScore(Form);
    });
    Form.VendorCertification.addEventListener("change", function () {
      CalculateScore(Form);
    });
    Form.FPRisk.addEventListener("change", function () {
      CalculateScore(Form);
    });
    Form.Application.addEventListener("change", function () {
      CalculateScore(Form);
    });
    Form.RQRisk.addEventListener("input", function () {
      CalculateScore(Form);
    });
    Form.NoAuditRequired.addEventListener("input", function () {
      CalculateScore(Form);
    });
  } else {
    console.log("Score Not calculated in IE Browser");
  }
  Form.NoAuditRequired.addEventListener("change", function () {
    ReasonShowHide(this.checked);
  });
}

function FormStyling(Form) {
  // REMOVE RIBBON ROW
  document.getElementById("s4-ribbonrow").style.display = "none";

  // CHANGE INPUT WIDTHS
  Form.VendorId.style.width = "150px";
  Form.Supplier.style.width = "300px";
  Form.GMN.style.width = "150px";
  Form.Description.style.width = "300px";
  Form.LastAssessment.style.width = "150px";
  Form.ProductCertification.style.width = "150px";
  Form.VendorCertification.style.width = "150px";
  Form.Application.style.width = "200px";
  Form.FPRisk.style.width = "150px";
  Form.RQRisk.style.width = "150px";
  Form.QA.style.width = "275px";

  // HIDE CALCULATED FIELDS
  HideField("AuditPlan");
  HideField("RiskScore");

  // INCLUDE AUDIT PLAN AND RISK SCORE AT TOP OF FORM
  InsertRow(
    "Title",
    "Assessment Results",
    "",
    "<span id=AuditResult>" +
      Form.AuditPlan.value +
      "</span><span id=Score>" +
      Form.RiskScore.value +
      "</span>",
    "display:flex; align-items:center; justify-content:space-between; height:33px; font-size:1rem;"
  );
  document
    .getElementById("AssessmentResults")
    .classList.add("ms-standardheader");
  document.getElementById("AssessmentResults").classList.add("ms-h3");
  document.getElementById("AssessmentResultsRow").style.background = "#8888";

  // CREATE ADD ATTACHMENT BUTTON FROM TOOLBAR ATTACH FILE BUTTON
  InsertRow(
    "AuditPlan",
    "Audit Documents",
    "",
    '<input type=button id=Attachment value="Attach Audit Document" onclick=javascript:AttachAuditDocument() href=javascript:; return false>',
    ""
  );
  document.getElementById("AuditDocuments").classList.add("ms-standardheader");
  document.getElementById("AuditDocuments").classList.add("ms-h3");
  document.getElementById("Attachment").classList.add("AddButton");
  document.getElementById("Attachment").style.marginLeft = "0";
  document.getElementById("Attachments").innerText = "";

  // SET READ ONLY FIELDS FOR EDIT FORM
  Form.VendorId.disabled = true;
  Form.Supplier.disabled = true;
  Form.SupplierSince.disabled = true;
  Form.SupplierSince.parentElement.nextSibling.style.display = "none";
  Form.GMN.disabled = true;
  if (Form.Description.value == "") {
    Form.Description.disabled = false;
  } else {
    Form.Description.disabled = true;
  }
  Form.VendorStatus.disabled = true;

  // CREATE VIEW SELECTOR
  const Information = "<h3 id=Info>Information</h3>";
  const Risks = "<h3 id=Risks>Risks Evalution</h3>";
  const Views = Information + Risks;
  InsertRow(
    "Title",
    "View Selector",
    "",
    Views,
    "display:flex; flex:1; width:400px"
  );
  document.getElementById("ViewSelectorRow").display = "table-row";
  document.getElementById("ViewSelector").innerText = "";
  document.getElementById("Info").addEventListener("click", function () {
    FormView(Form, "Info");
  });
  document.getElementById("Risks").addEventListener("click", function () {
    FormView(Form, "Risks");
  });

  // CREATE HELP LINKS
  Form.SupplierSince.parentElement.nextSibling.insertAdjacentHTML(
    "afterend",
    '<input type=button id=SupplierSinceInfo class=Help title="Help" value=? return false>'
  );
  Form.LastAssessment.parentElement.nextSibling.insertAdjacentHTML(
    "afterend",
    '<input type=button id=LastAssessmentInfo class=Help title="Help" value=? return false>'
  );
  Form.ProductCertification.insertAdjacentHTML(
    "afterend",
    '<input type=button id=ProductInfo class=Help title="Help" value=? return false>'
  );
  Form.VendorCertification.insertAdjacentHTML(
    "afterend",
    '<input type=button id=RawInfo class=Help title="Help" value=? return false>'
  );
  Form.Application.insertAdjacentHTML(
    "afterend",
    '<input type=button id=ApplicationInfo class=Help title="Help" value=? return false>'
  );
  Form.FPRisk.insertAdjacentHTML(
    "afterend",
    '<input type=button id=FPRInfo class=Help title="Help" value=? return false>'
  );
  Form.RQRisk.insertAdjacentHTML(
    "afterend",
    '<input type=button id=RQInfo class=Help title="Help" value=? return false>'
  );

  // ADD EVENT LISTENERS TO HELP BUTTONS
  document
    .getElementById("SupplierSinceInfo")
    .addEventListener("click", function () {
      ShowMetaData("SupplierSince");
    });
  document
    .getElementById("LastAssessmentInfo")
    .addEventListener("click", function () {
      ShowMetaData("LastAssessment");
    });
  document.getElementById("ProductInfo").addEventListener("click", function () {
    ShowMetaData("PCertification");
  });
  document.getElementById("RawInfo").addEventListener("click", function () {
    ShowMetaData("VCertification");
  });
  document
    .getElementById("ApplicationInfo")
    .addEventListener("click", function () {
      ShowMetaData("Application");
    });
  document.getElementById("FPRInfo").addEventListener("click", function () {
    ShowMetaData("FPRisk");
  });
  document.getElementById("RQInfo").addEventListener("click", function () {
    ShowMetaData("RQRisk");
  });

  // INSERT PREVIOUS AND NEXT BUTTONS
  Form.SaveButton.style.display = "none";
  Form.SaveButton.insertAdjacentHTML(
    "beforeBegin",
    "<input id=NextButton type=button value=Next title='Go to Risk Evaluation' return false/>"
  );
  document.getElementById("NextButton").addEventListener("click", function () {
    FormView(Form, "Risks");
  });
}

function FormView(Form, View) {
  console.clear();
  console.log(View + " Selected");
  const ViewSelected = document.getElementById(View);
  const Info = document.getElementById("Info");
  const Risks = document.getElementById("Risks");
  // REMOVE SELECTED CLASS FROM ALL VIEWS
  Info.classList.remove("Selected");
  Risks.classList.remove("Selected");

  // ADD NOTSELECTED CLASS FROM ALL VIEWS
  Info.classList.add("NotSelected");
  Risks.classList.add("NotSelected");

  // CHANGE SELECTED VIEW CLASS
  ViewSelected.classList.add("Selected");
  ViewSelected.classList.remove("NotSelected");
  ClearForm(Form);

  // DETERMINE SELECTED VIEW
  if (View == "Info") {
    InfoView(Form);
  }
  if (View == "Risks") {
    RisksView(Form);
  }
}

function ClearForm(Form) {
  let i;
  for (i in Form) {
    if (Form[i] != Form.SaveButton && Form[i] != Form.FormType) {
      if (Form[i] == Form.LastAssessment || Form[i] == Form.SupplierSince) {
        Form[
          i
        ].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display =
          "none";
      } else {
        Form[i].parentElement.parentElement.parentElement.style.display =
          "none";
      }
    }
  }
  HideField("Attachments");
}

// =====================================================================================
// INFO VIEW
// =====================================================================================
function InfoView(Form) {
  console.log("InfoView Script Found");
  if (Form.FormType == "New") {
    Form.VendorId.disabled = false;
    Form.Supplier.disabled = false;
    Form.SupplierSince.disabled = false;
    Form.SupplierSince.parentElement.nextSibling.style.display = "table-cell";
    Form.GMN.disabled = false;
    Form.Description.disabled = false;
    Form.VendorStatus.disabled = false;
  }
  ShowField("Title");
  ShowField("Supplier");
  ShowField("SupplierSince");
  HideMetaData("SupplierSince");
  ShowField("GMN");
  ShowField("Material_x0020_Description");
  ShowField("Status");
  ShowField("QA_x0020_Responsible");
  ShowField("Inactive");
  ShowField("Attachments");
  document.getElementById("AuditDocumentsRow").style.display = "table-row";
  document.getElementById("NextButton").style.display = "inline-block";
  Form.SaveButton.style.display = "none";
  ShortenAttachmentName();
}

function AttachAuditDocument() {
  SP.Ribbon.PageManager.get_instance().executeRootCommand(
    "Ribbon.ListForm.Edit.Actions.AttachFile",
    null,
    null,
    null
  );
  const OKButton = document.getElementById("attachOKbutton");
  OKButton.addEventListener("click", function () {
    ShortenAttachmentName();
  });
}

function ShortenAttachmentName() {
  const AttachmentTable = document.getElementById("idAttachmentsTable");
  let Attachments = AttachmentTable.children.length;
  if (Attachments > 0) {
    const AttachmentRow = AttachmentTable.children[0].children;
    Attachments = AttachmentRow.length;
    console.log("Attachments = " + Attachments);
    let FileName;
    for (i = 0; i < Attachments; i++) {
      FileName = AttachmentRow[i].children[0].children[0].innerText;
      BackSlashIndex = FileName.lastIndexOf("\\");
      if (BackSlashIndex > 0) {
        FileName = FileName.substring(BackSlashIndex + 1);
        AttachmentRow[i].children[0].children[0].innerText = FileName;
      }
    }
  }
}
// =====================================================================================
// RISKS VIEW AND FUNCTIONS
// =====================================================================================
function RisksView(Form) {
  document.getElementById("AuditDocumentsRow").style.display = "none";
  Form.Supplier.disabled = true;
  Form.GMN.disabled = true;
  console.log("RisksView Script Found");
  ShowField("Supplier");
  ShowField("GMN");
  ShowField("Material_x0020_Description");
  ShowField("LastAssessment");
  HideMetaData("LastAssessment");
  ShowField("PCertification");
  HideMetaData("PCertification");
  ShowField("VCertification");
  HideMetaData("VCertification");
  ShowField("FPRisk");
  HideMetaData("FPRisk");
  ShowField("Application");
  HideMetaData("Application");
  ShowField("RQRisk");
  HideMetaData("RQRisk");
  ShowField("NotRequired");
  ReasonShowHide(Form.NoAuditRequired.checked);
  document.getElementById("NextButton").style.display = "none";
  Form.SaveButton.style.display = "inline-block";
}

function ReasonShowHide(NoAuditRequired) {
  console.log("No Audit Required: ", NoAuditRequired);
  if (NoAuditRequired) {
    ShowField("ReasonNotRequired");
  } else {
    HideField("ReasonNotRequired");
    document.getElementById(
      "ReasonNotRequired_d0f12ad1-22aa-4c7e-a177-79d8808f4b9d_$TextField"
    ).value = "";
  }
}

function HideMetaData(FieldName) {
  const InputCell =
    document.getElementById(FieldName).parentElement.nextElementSibling;
  let MetaData;
  if (InputCell.children.length > 1) {
    MetaData = InputCell.children[1];
    MetaData.style.display = "none";
  }
}

function ShowMetaData(FieldName) {
  const InputCell =
    document.getElementById(FieldName).parentElement.nextElementSibling;
  let MetaData;
  if (InputCell.children.length > 1) {
    MetaData = InputCell.children[1];
    if (MetaData.style.display == "none") {
      MetaData.style.display = "inline";
    } else {
      MetaData.style.display = "none";
    }
  }
}

function MarkNotRequired(Form) {
  if (Form.Application.value == "Catalyst/Process Aid") {
    Form.NoAuditRequired.checked = true;
    Form.ReasonNotRequired.value =
      "Catatlyst & Processing Aids typically don't effect final product quality.";
  }
}

function CalculateScore(Form) {
  console.clear();
  console.log("CalculateScore Script Found");
  let Max,
    Note,
    Value,
    Calc,
    MetaData,
    MetaDataText,
    Table,
    Row,
    Relationship,
    Age,
    Vendor,
    Product,
    Certification,
    FPRisk,
    Application,
    RQRisk,
    Score,
    AuditPlan;

  // SUPPLIER RELATIONSHIP FACTOR
  Max = 10;
  Note = "";
  let Years =
    new Date().getFullYear() - new Date(Form.SupplierSince.value).getFullYear();
  let CalcYears = Years;
  Calc = (CalcYears / Max) * 100;
  if (Years >= Max) {
    Calc = 100;
    CalcYears = Max;
    Note =
      "<br><span style=color:rgb(217,26,58)><b>Max Years Reached</b> (<b>CalcRelationship</b> = " +
      Max +
      ")</span>";
  }
  Relationship = Math.round(Calc * 0.17).toFixed();
  console.log("Relationship = " + Relationship);
  // CALCULATION META DATA
  MetaDataText =
    '<span id=RelationshipCalc style="font-size:12px; font-weight:normal">' +
    "<br><b>Relationship</b> = " +
    new Date().getFullYear() +
    " - " +
    new Date(Form.SupplierSince.value).getFullYear() +
    " = " +
    Years +
    Note +
    "<br><b>Relationship Evaluation</b> = CalcRelationship/ Max" +
    "<br><b>Relationship Evaluation</b> = " +
    CalcYears +
    "/" +
    Max +
    " = " +
    (Calc / 100).toFixed(2) +
    "<br><b>Relationship Score</b> = " +
    Calc.toFixed() +
    "<br>" +
    "<br><b>Risk Score Weight</b> = " +
    Calc.toFixed() +
    "* 0.17 = <b>" +
    Relationship +
    "</b></span>";
  if (document.getElementById("RelationshipCalc") == undefined) {
    MetaData =
      Form.SupplierSince.parentElement.parentElement.parentElement.parentElement
        .parentElement.nextElementSibling;
    MetaData.style.fontSize = "1.2em";
    MetaData.style.fontWeight = "bold";
    MetaData.insertAdjacentHTML("beforeend", MetaDataText);
  } else {
    document.getElementById("RelationshipCalc").innerHTML = MetaDataText;
  }

  // AGE RISK FACTOR
  Max = 3;
  Years =
    new Date().getFullYear() -
    new Date(Form.LastAssessment.value).getFullYear();
  if (Form.LastAssessment.value === "" || Years >= Max) {
    CalcYears = Max;
    Note =
      "<br><span style=color:rgb(217,26,58)><b>Max Years Reached</b> (<b>CalcAge</b> = " +
      Max +
      ")</span>";
  } else {
    CalcYears = Years;
    Note = "";
  }
  Calc = ((Max - CalcYears) / Max) * 100;
  Age = Math.round(Calc * 0.17).toFixed();
  console.log("Age = " + Age);

  // CALCULATION META DATA
  MetaDataText =
    '<span id=AgeCalc style="font-size:12px; font-weight:normal">' +
    "<br><b>Age</b> = " +
    new Date().getFullYear() +
    " - " +
    new Date(Form.LastAssessment.value).getFullYear() +
    " = " +
    Years +
    Note +
    "<br><b>Age Evaluation</b> = (Max - CalcAge)/Max)" +
    "<br><b>Age Evaluation</b> = (" +
    Max +
    " - " +
    CalcYears +
    ")/" +
    Max +
    " = " +
    (Calc / 100).toFixed(2) +
    "<br><b>Age Score</b> = " +
    Calc.toFixed() +
    "<br>" +
    "<br><b>Risk Score Weight</b> = " +
    Calc.toFixed() +
    "* 0.17 = <b>" +
    Age +
    "</b></span>";
  if (document.getElementById("AgeCalc") == undefined) {
    MetaData =
      Form.LastAssessment.parentElement.parentElement.parentElement
        .parentElement.parentElement.nextElementSibling;
    MetaData.style.fontSize = "1.2em";
    MetaData.style.fontWeight = "bold";
    MetaData.insertAdjacentHTML("beforeend", MetaDataText);
  } else {
    document.getElementById("AgeCalc").innerHTML = MetaDataText;
  }

  // CERTIFICATION RISK FACTOR
  Vendor = Form.VendorCertification.selectedIndex;
  Product = Form.ProductCertification.selectedIndex;
  if (Product < Vendor || Product == 0) {
    Calc = 100;
    Note =
      "<br><span style=color:rgb(217,26,58)><b>Vendor Certification Surpasses Product Certification</b></span>";
  } else if (Product === Vendor) {
    Calc = 100;
    Note =
      "<br><span style=color:rgb(217,26,58)><b>Vendor Certification Matches Product Certification</b></span>";
  } else {
    Calc = (Vendor / Product) * 100;
    Note = "";
  }
  Certification = Math.round(Calc * 0.17).toFixed();
  console.log("Certification = " + Certification);

  // CALCULATION META DATA
  MetaDataText =
    '<span id=CertificationCalc style="font-size:12px; font-weight:normal">' +
    Note +
    "<br><b>Certification Evaluation</b> = Vendor/Product" +
    "<br><b>Certification Evaluation</b> = " +
    Vendor +
    "/" +
    Product +
    " = " +
    (Calc / 100).toFixed(2) +
    "<br><b>Certification Score</b> = " +
    Calc.toFixed() +
    "<br><b>Risk Score Weight</b> = " +
    Calc.toFixed() +
    "* 0.17 = <b>" +
    Certification +
    "</b></span>";

  // VENDOR CERTIFICATION META DATA
  Table =
    '<br><table id=CertificationTable style="border-spacing:0; font-weight:normal; font-size:14px"><tbody><tr id=CertificationRow><th style="padding:0 10px; text-align:left">Certification</th><th>Value</th></tr></tbody></table>';
  MetaData = Form.VendorCertification.parentElement.nextElementSibling;
  if (document.getElementById("CertificationTable") == undefined) {
    MetaData.insertAdjacentHTML("beforeend", Table);
    for (i = 0; i < Form.ProductCertification.length; i++) {
      Certification = Form.ProductCertification.children[i].innerText;
      Row =
        '<tr><td style="padding:0 10px">' +
        Certification +
        '</td><td style="text-align:center">' +
        i +
        "</td></tr>";
      document
        .getElementById("CertificationRow")
        .insertAdjacentHTML("afterend", Row);
    }
  }
  if (document.getElementById("CertificationCalc") == undefined) {
    MetaData.style.fontSize = "1.2em";
    MetaData.style.fontWeight = "bold";
    MetaData.insertAdjacentHTML("beforeend", MetaDataText);
  } else {
    document.getElementById("CertificationCalc").innerHTML = MetaDataText;
  }

  // PRODUCT CERTIFICATION META DATA
  MetaData = Form.ProductCertification.parentElement.nextElementSibling;
  MetaData.style.fontSize = "1.2em";
  MetaData.style.fontWeight = "bold";
  Note =
    '<br><span id=PCertificationCalc style="color:rgb(217,26,58); font-size:14px"><b>Please see Vendor Certification for Calculation</b></span>';
  if (document.getElementById("PCertificationCalc") == undefined) {
    MetaData.insertAdjacentHTML("beforeend", Note);
  }
  Certification = Math.round(Calc * 0.17).toFixed();

  // APPLICATION RISK FACTOR
  Max = Math.round(Form.Application.length) - 1;
  Value = Form.Application.selectedIndex;
  if (Form.Application.selectedOptions[0].innerText === "") {
    Value = Max;
    Note =
      "<br><span style=color:rgb(217,26,58)><b>Application NOT Selected</b> (Value = " +
      Max +
      ")</span>";
  } else if (Form.Application.selectedIndex == 1) {
    Form.FPRisk.selectedIndex = 1;
    Form.RQRisk.selectedIndex = 1;
    Note =
      "<br><span style=color:rgb(217,26,58)><b>Raw Material holds No Risk to Process</b></span>";
  } else {
    Note = "";
  }
  Calc = ((Max - Value) / Max) * 100;
  Application = Math.round(Calc * 0.09).toFixed();
  console.log("Application Risk = " + Application);

  // CALCULATION META DATA
  MetaDataText =
    '<span id=ApplicationCalc style="font-size:14px; font-weight:normal">' +
    Note +
    "<br><b>Application Evaluation</b> = (Max - Application Value)/Max" +
    "<br><b>Application Evaluation</b> = (" +
    Max +
    " - " +
    Value +
    ")/" +
    Max +
    " = " +
    (Calc / 100).toFixed(2) +
    "<br><b>Application Score</b> = " +
    Calc.toFixed() +
    "<br><b>Risk Score Weight</b> = " +
    Calc.toFixed() +
    "* 0.09 * 100 = <b>" +
    Application +
    "</b></span>";

  // APPLICATION META DATA
  Table =
    '<br><table id=ApplicationTable style="border-spacing:0; font-weight:normal; font-size:14px"><tbody><tr id=ApplicationRow><th style="padding:0 10px; text-align:left">Application</th><th>Value</th></tr></tbody></table>';
  MetaData = Form.Application.parentElement.nextElementSibling;
  if (document.getElementById("ApplicationTable") == undefined) {
    MetaData.insertAdjacentHTML("beforeend", Table);
    for (i = 0; i < Form.Application.length; i++) {
      Application = Form.Application.children[i].innerText;
      Row =
        '<tr><td style="padding:0 10px">' +
        Application +
        '</td><td style="text-align:center">' +
        i +
        "</td></tr>";
      document
        .getElementById("ApplicationRow")
        .insertAdjacentHTML("afterend", Row);
    }
  }
  if (document.getElementById("ApplicationCalc") == undefined) {
    MetaData.style.fontSize = "1.2em";
    MetaData.style.fontWeight = "bold";
    MetaData.insertAdjacentHTML("beforeend", MetaDataText);
  } else {
    document.getElementById("ApplicationCalc").innerHTML = MetaDataText;
  }
  Application = Math.round(Calc / 6).toFixed();

  // FINAL PRODUCT RISK FACTOR
  Max = Math.round(Form.FPRisk.length) - 1;
  Value = Form.FPRisk.selectedIndex;
  if (Form.FPRisk.selectedOptions[0].innerText === "") {
    Value = Max;
    Note =
      "<br><span style=color:rgb(217,26,58)><b>Final Product Risk NOT Selected</b> (Value = " +
      Max +
      ")</span>";
  } else {
    Note =
      "<br><span style=color:rgb(217,26,58)><b>**Final Product Risk Subject to QA Consideration**</b></span>";
  }
  Calc = ((Max - Value) / Max) * 100;
  FPRisk = Math.round(Calc * 0.17).toFixed();
  console.log("Final Product Risk = " + FPRisk);
  // CALCULATION META DATA
  MetaDataText =
    '<span id=FPCalc style="font-size:12px; font-weight:normal">' +
    Note +
    "<br><b>Final Product Evaluation</b> = (Max - Final Product Risk Value)/Max" +
    "<br><b>Final Product Evaluation</b> = (" +
    Max +
    " - " +
    Value +
    ")/" +
    Max +
    " = " +
    (Calc / 100).toFixed(2) +
    "<br><b>Final Product Score</b> = " +
    Calc.toFixed() +
    "<br><b>Risk Score Weight</b> = " +
    Calc.toFixed() +
    "* 0.17 = <b>" +
    FPRisk +
    "</b></span>";
  // FINAL PRODUCT RISK META DATA
  MetaData = Form.FPRisk.parentElement.nextElementSibling;
  if (document.getElementById("FPRiskFactors") == undefined) {
    let RiskFactors =
      '<ul id=FPRiskFactors style="font-size:12px;">' +
      "<li>High Volume Product</li>" +
      "<li>High Production Cost</li>" +
      "<li>High Profit Margin (>1.5M)</li>" +
      "<li>High Demand Product</li>" +
      "<li>Product used in cGMP Processes</li></ul>";
    MetaData.insertAdjacentHTML("beforeend", RiskFactors);
  }
  Table =
    '<table id=FPTable style="border-spacing:0; font-weight:normal; font-size:14px"><tbody><tr id=FPRow><th style="padding:0 10px; text-align:left">Final Product Risk</th><th>Value</th></tr></tbody></table>';
  if (document.getElementById("FPTable") == undefined) {
    MetaData.insertAdjacentHTML("beforeend", Table);
    for (i = 0; i < Form.FPRisk.length; i++) {
      FPRisk = Form.FPRisk.children[i].innerText;
      Row =
        '<tr><td style="padding:0 10px">' +
        FPRisk +
        '</td><td style="text-align:center">' +
        i +
        "</td></tr>";
      document.getElementById("FPRow").insertAdjacentHTML("afterend", Row);
    }
  }
  if (document.getElementById("FPCalc") == undefined) {
    MetaData.style.fontSize = "1.2em";
    MetaData.style.fontWeight = "bold";
    MetaData.insertAdjacentHTML("beforeend", MetaDataText);
  } else {
    document.getElementById("FPCalc").innerHTML = MetaDataText;
  }
  FPRisk = Math.round(Calc / 6).toFixed();
  // RAW QUALITY RISK FACTOR
  Max = Math.round(Form.RQRisk.length) - 1;
  Value = Form.RQRisk.selectedIndex;
  if (Form.RQRisk.selectedOptions[0].innerText === "") {
    Value = Max;
    Note =
      "<br><span style=color:rgb(217,26,58)><b>Raw Quality Risk NOT Selected</b> (Value = " +
      Max +
      ")</span>";
  } else {
    Note =
      "<br><span style=color:rgb(217,26,58)><b>**Raw Quality Risk Subject to QA Consideration**</b></span>";
  }
  Calc = ((Max - Value) / Max) * 100;
  RQRisk = Math.round(Calc * 0.25).toFixed();
  console.log("Raw Quality Risk = " + RQRisk);
  // CALCULATION META DATA
  MetaData = Form.RQRisk.parentElement.nextElementSibling;
  MetaDataText =
    '<span id=RQCalc style="font-size:12px; font-weight:normal">' +
    Note +
    "<br><b>Raw Quality Risk Evaluation</b> = (Max - Raw Quality Risks)/Max" +
    "<br><b>Raw Quality Risk Evaluation</b> = (" +
    Max +
    " - " +
    Value +
    ")/" +
    Max +
    " = " +
    (Calc / 100).toFixed(2) +
    "<br><b>Raw Quality Score</b> = " +
    Calc.toFixed() +
    "<br><b>Risk Score Weight</b> = " +
    Calc.toFixed() +
    "* 0.25 = <b>" +
    RQRisk +
    "</b></span>";
  if (document.getElementById("RQRiskFactors") == undefined) {
    RiskFactors =
      '<ul id=RQRiskFactors style="font-size:12px;">' +
      "<li>Non-Conformances Filed</li>" +
      "<li>Near Non-Conformances</li>" +
      "<li>Late Deliveries</li>" +
      "<li>Out of Specification Deliveries</li>" +
      "<li>Paperwork Issues with Deliveries</li></ul>";
    MetaData.insertAdjacentHTML("beforeend", RiskFactors);
  }
  if (document.getElementById("RQCalc") == undefined) {
    MetaData.style.fontSize = "1.2em";
    MetaData.style.fontWeight = "bold";
    MetaData.insertAdjacentHTML("beforeend", MetaDataText);
  } else {
    document.getElementById("RQCalc").innerHTML = MetaDataText;
  }

  // OVER ALL RISK SCORE
  Score =
    +Relationship + +Age + +Certification + +FPRisk + +Application + +RQRisk;
  if (Form.LastAssessment.value === "") {
    Score = Form.RiskScore.value;
    AuditPlan = "No Risk Score";
  }
  document.getElementById("Score").innerText = Score;
  console.log("Score = " + Score);

  // SET AUDIT PLAN VALUE
  if (Score >= 75) {
    AuditPlan = "No Audit";
    document.getElementById("Score").style.color = "#f4f4f4";
    document.getElementById("Score").style.background = "rgb(0,134,81)";
    document.getElementById("AssessmentResultsRow").style.background =
      "rgba(0,134,81,0.3)";
  }
  if (Score < 75) {
    AuditPlan = "Self Audit";
    document.getElementById("Score").style.color = "#444";
    document.getElementById("Score").style.background = "rgb(255,207,64)";
    document.getElementById("AssessmentResultsRow").style.background =
      "rgba(255,207,64,0.3)";
    console.log("Score < 90");
  }
  if (Score < 50) {
    AuditPlan = "Site Audit";
    document.getElementById("Score").style.background = "rgb(217,26,58)";
    document.getElementById("AssessmentResultsRow").style.background =
      "rgba(217,26,58,0.3)";
    console.log("Score < 50");
  } else {
    document.getElementById("Score").style.color = "#f4f4f4";
  }
  if (AuditPlan == "No Risk Score") {
    document.getElementById("Score").style.background = "none";
    document.getElementById("AssessmentResultsRow").style.background =
      "rgba(136, 136, 136, 0.5)";
  }
  if (Form.ProductCertification.value == "ISO 22000") {
    AuditPlan = "GQ Audit";
  }
  if (Form.NoAuditRequired.checked) {
    AuditPlan = "No Audit";
    document.getElementById("AssessmentResultsRow").style.background =
      "rgba(0,134,81,0.3)";
    document.getElementById("AuditResult").innerText += " - No Risk to Product";
  }
  Form.AuditPlan.value = AuditPlan;
  document.getElementById("AuditResult").innerText = AuditPlan;
  console.log("Audit Plan = " + Form.AuditPlan.value);
}
