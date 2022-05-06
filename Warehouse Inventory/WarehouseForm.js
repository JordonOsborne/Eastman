function WarehouseForm() {
  const Form = GetForm();
  console.log("Starting Form Script");
  SetCategory(Form);
  BuildView(Form);
  SetUnitDescription(Form);
  Form.GMN.addEventListener("input", function () {
    GetGMNDescription(Form);
  });
  Form.GMN.addEventListener("input", function () {
    ForceUppercase(this);
  });
  Form.UnitType.addEventListener("change", function () {
    SetUnitDescription(Form);
  });
  Form.Batch.addEventListener("input", function () {
    ForceUppercase(this);
  });
  Form.Batch.addEventListener("input", function () {
    CheckUnique(Form);
  });
}

function GetForm() {
  Form = {
    Section: document.getElementById(
      "Category_4fae873c-dd59-4db0-9e50-ad3c668b6033_$DropDownChoice"
    ),
    GMN: document.getElementById(
      "Title_fa564e0f-0c70-4ab9-b863-0177e6ddd247_$TextField"
    ),
    Description: document.getElementById(
      "Description_9a2f71bd-a476-4f65-af56-aa25d7afc84e_$TextField"
    ),
    Batch: document.getElementById(
      "Batch_8682cf4b-d707-4180-a0da-7f7f6771115c_$TextField"
    ),
    SL: document.getElementById(
      "SL_1ed5bc20-1944-4e3c-ad23-5fe8835b1abd_$TextField"
    ),
    DrumType: document.getElementById(
      "DrumType_6c667738-ac8b-4dfb-a26a-619611c41db5_$DropDownChoice"
    ),
    UnitType: document.getElementById(
      "UnitType_a5eb0ffd-e2dc-4bf6-91b2-a1a5c6b4ceb4_$DropDownChoice"
    ),
    UnitUOM: document.getElementById(
      "UnitUOM_c407b22f-1a9b-44e3-b732-28c86c35cfc1_$DropDownChoice"
    ),
    UnitQty: document.getElementById(
      "UnitQty_60d598e3-523e-4d96-977b-e2473f8ca7c7_$NumberField"
    ),
    Units: document.getElementById(
      "Units_22bdf702-31dd-48c0-8d99-881ff52ba756_$NumberField"
    ),
    PITag: document.getElementById(
      "PITag_476b3461-753b-41eb-bfae-667b00497122_$TextField"
    ),
    Minimum: document.getElementById(
      "Minimum_8bc106af-5c0c-40d3-88b5-2ec7ffdfdcda_$NumberField"
    ),
    SupplyPlanner: document.getElementById(
      "SupplyPlanner_9596d286-e129-4303-ab8d-d912b173a080_$ClientPeoplePicker"
    ),
    Comments: document.getElementById(
      "Comments_2930a136-9b38-499b-bbc2-b47e11c9ee7d_$TextField_topDiv"
    ),
    SentToPI: document.getElementById(
      "SentToPI_3360590d-2a17-47cd-a630-a92f5e85eca7_$DateTimeFieldDate"
    ),
    Inactive: document.getElementById(
      "Inactive_95b5a92d-2ead-4adb-af23-25b0f17e1e9f_$BooleanField"
    ),
  };
  if (document.location.href.indexOf("NewForm") > 0) {
    Form.FormType = "NEW";
  } else {
    Form.FormType = "EDIT";
  }
  return Form;
}

function SetCategory(Form) {
  let Section = GetSectionQueryString();
  if (Section === null) {
    Section = "";
  }
  SetValue(Form.Section, Section);
}

function GetIDQueryString() {
  let URL, params, ID;
  URL = document.location.search.substring(1);
  if (!IEBrowser()) {
    params = new URLSearchParams(URL);
    ID = params.get("ID");
  } else {
    Start = URL.indexOf("ID=") + 3;
    params = URL.substring(Start);
    if (param.indexOf("&") != -1) {
      End = URL.indexOf("&");
    } else {
      End = URL.length;
    }
    ID = URL.substring(Start, End);
  }
  return ID;
}

function GetSectionQueryString() {
  let URL, params, Section;
  URL = document.location.search.substring(1);
  if (!IEBrowser()) {
    params = new URLSearchParams(URL);
    Section = params.get("Section");
  } else {
    if (URL.indexOf("&IsDlg=1") != -1) {
      End = URL.indexOf("&IsDlg=1");
    } else {
      End = URL.length;
    }
    Section = URL.substring(URL.indexOf("Section=") + 8, End);
  }
  return Section;
}

function BuildView(Form) {
  let LastSent =
    "<h4 class=Inline-Label>PI Updated: <span id=LastSent>N/A</span></h4>";
  let Section = Form.Section.value;
  // DISABLE DESCRIPTION FIELD WHERE GMN SEARCH IS APPLICABLE
  Disable(Form.Description);
  if (Section === "Filters" || Section === "Sample Bottles") {
    Enable(Form.Description);
  }
  // MOVE UOM BESIDE UNIT QUANTITY & MINIMUM
  InsertBeside(Form.UnitQty, "", Form.UnitUOM);
  InsertBeside(Form.Minimum, Form.UnitUOM.value, "");

  // SHOW LAST TIME SENT TO PI BESIDE UNITS
  Form.Units.insertAdjacentHTML("afterend", LastSent);
  GetSentToPIData(Form);
  LastSent = document.getElementById("LastSent");
  LastSent.style.fontWeight = "normal";

  // BUILD SECTION SPECIFIC FORMS
  Section = GetSectionQueryString();
  if (Section === null) {
    console.log("Section NOT Found in Query String");
  } else {
    ClearForm(Form);
    ShowField("Units");
    console.log("Section Found: ", Section);
    Disable(Form.PITag);
    // DEFINE EACH VIEW
    if (Section == "PZ") {
      ShowField("Title");
      ShowField("Description");
      ShowField("SL");
      ShowField("UnitType");
      ShowField("UnitQty");
      ShowField("PITag");
      ShowField("Minimum");
      ShowField("SupplyPlanner");
    }
    if (Section == "AOX") {
      ShowField("Title");
      ShowField("Description");
      ShowField("Batch");
      ShowField("PITag");
      ShowField("UnitType");
      ShowField("Comments");
    }
    if (Section == "Filters") {
      ChangeGMNtoPartNumber(Form);
      SetValue(Form.UnitType, "Box");
      ShowField("Title");
      ShowField("Description");
      ShowField("UnitType");
      ShowField("UnitQty");
      ShowField("Minimum");
      ShowField("Comments");
      ShowField("Inactive");
      document.getElementById("LastSent").parentElement.style.display = "none";
    }
    if (Section == "Sample Bottles") {
      ChangeGMNtoPartNumber(Form);
      SetValue(Form.UnitType, "Box");
      ShowField("Title");
      ShowField("Description");
      ShowField("UnitType");
      ShowField("UnitQty");
      ShowField("Minimum");
      ShowField("Comments");
      ShowField("Inactive");
      document.getElementById("LastSent").parentElement.style.display = "none";
    }
    if (Section == "Blocked Stock") {
      Form.UnitType.addEventListener("change", function () {
        CheckDrumWeight(Form);
      });
      if (Form.UnitType.value == "") {
        SetValue(Form.UnitType, "Drum");
        ShowField("DrumType");
      }
      CheckDrumWeight(Form);
      ShowField("Title");
      ShowField("Description");
      ShowField("Batch");
      ShowField("UnitType");
      ShowField("Comments");
      document.getElementById("LastSent").parentElement.style.display = "none";
    }
    if (Section == "Tote") {
      SetValue(Form.GMN, "P0112003");
      SetValue(Form.Description, "RESTRICTED");
      SetValue(Form.UnitType, "Tote/Bin");
      Disable(Form.GMN);
      Disable(Form.UnitType);
      ShowField("Title");
      ShowField("Description");
      ShowField("Batch");
      HideField("Units");
      ShowField("Comments");
      if (Form.FormType == "NEW") {
        Form.Units.value = 1;
      }
      document.getElementById("LastSent").parentElement.style.display = "none";
    }
  }
}

function CopyValue(Input) {
  const Value = document.getElementById("UnitUOMCopy").value;
  SetValue(Input, Value);
  document.getElementById("LBText").innerText = Value;
}

function GetSentToPIData(Form) {
  console.log("Getting Date Last Sent to PI");
  const Filter = {
    PITag: {
      Type: "text",
      Value: "",
      FilterType: "Neq",
    },
    Title: {
      Type: "text",
      Value: Form.GMN.value,
      FilterType: "Eq",
    },
  };
  const Return = ["PITag", "SentToPI"];
  FindListItem("Warehouse Inventory", Filter, Return);
}

function WriteToTable(Item) {
  const LastSent = document.getElementById("LastSent");
  if (Item.SentToPI != null) {
    let DateTimeSent = new Date(Item.SentToPI)
      .toLocaleString()
      .replace(",", "");
    LastSent.innerText = DateTimeSent;
  }
}

function GetGMNDescription(Form) {
  const Section = Form.Section.value;
  let Filter, Return, Result, Description, Wait;
  if (Section != "Filters" && Section != "Sample Bottles") {
    if (Form.GMN.value.length === 8) {
      Filter = {
        Title: {
          Type: "text",
          Value: Form.GMN.value,
          FilterType: "Eq",
        },
      };
      Return = ["Title", "Material_x0020_Description"];
      FindListItem("GMNs", Filter, Return);
    }
    if (!IEBrowser()) {
      Wait = 2000;
    } else {
      Wait = 3000;
    }
    setTimeout(function () {
      try {
        Result = Object.keys(ItemsFound);
        if (Result.length > 0) {
          Result = ItemsFound[Result[0]];
          Description = Result.Material_x0020_Description;
          Form.Description.value = Description;
          CheckUnique(Form);
        }
      } catch (error) {
        console.log("GMN must be 8 characters in length.");
      }
    }, Wait);
  } else {
    console.log("Description Search NOT running.");
  }
}

function ChangeGMNtoPartNumber(Form) {
  const GMNDiv = document.getElementById("Title");
  const Section = Form.Section.value;
  if (Section === "Filters" || Section === "Sample Bottles") {
    GMNDiv.innerText = "Part Number";
  }
}

function SetUnitDescription(Form) {
  const UnitDescription = document.getElementById("UnitQty");
  const UnitType = Form.UnitType.value;
  const UnitUOM = document.getElementById("UnitUOMCopy");
  try {
    if (UnitType === "Box" || UnitType === "Skid" || UnitType === "Case") {
      SetValue(UnitUOM, "EA");
      Disable(UnitUOM);
      document.getElementById("LBText").innerText = UnitUOM.value;
      UnitDescription.innerText = UnitType + " Quantity";
    } else {
      SetValue(UnitUOM, "LB");
      Enable(UnitUOM);
      document.getElementById("LBText").innerText = UnitUOM.value;
      UnitDescription.innerText = UnitType + " Weight";
    }
  } catch (Error) {
    console.log("Error: " + Error.message);
  }
}

function CheckDrumWeight(Form) {
  console.log("Check Drum Type Script Found");
  const UnitType = Form.UnitType.value;
  const DrumWeight = parseInt(Form.Description.value.replace(/\D/g, ""));
  console.log("Drum Weight: ", DrumWeight);
  if (Form.Section.value != "Blocked Stock") {
    HideField("DrumType");
    ShowField("UnitQty");
  } else if (UnitType != "Drum" && Form.Section.value === "Blocked Stock") {
    HideField("DrumType");
    ShowField("UnitQty");
  } else {
    ShowField("DrumType");
    HideField("UnitQty");
    if (!isNaN(DrumWeight)) {
      SetValue(Form.UnitQty, DrumWeight);
    }
  }
}

function CheckUnique(Form) {
  const Section = Form.Section.value;
  const ID = GetIDQueryString();
  const UIDCalc =
    Form.Section.value + "-" + Form.GMN.value + "-" + Form.Batch.value;
  let Filter, Return, Wait;
  if (
    Form.GMN.value.length === 8 &&
    (Section != "Sample Bottles" || Section != "Filters") &&
    Batch != ""
  ) {
    Filter = {
      UID: {
        Type: "text",
        Value: UIDCalc,
        FilterType: "Eq",
      },
    };
    if (ID != null) {
      Filter.ID = {
        Type: "int",
        Value: ID,
        FilterType: "Neq",
      };
    }
    Return = ["ID", "Title", "Category", "Batch", "UID"];
    FindListItem("Warehouse Inventory", Filter, Return);
    if (IEBrowser()) {
      Wait = 2000;
    } else {
      Wait = 500;
    }
    setTimeout(function () {
      IsUnique(Form);
    }, Wait);
  }
}

function IsUnique(Form) {
  const Error =
    '<span id=BatchError class=ErrorMsg style="display:none;">Batch already exist in the ' +
    Form.Section.value +
    " Section</span>";
  if (document.getElementById("BatchError") == null) {
    Form.Batch.insertAdjacentHTML("afterend", Error);
  }
  if (Object.keys(ItemsFound).length != 0) {
    Form.Batch.classList.add("Error");
    document.getElementById("BatchError").style.display = "inline-block";
  } else {
    Form.Batch.classList.remove("Error");
    document.getElementById("BatchError").style.display = "none";
  }
}
