function CheckUnloadStatus() {
  console.log("CheckUnloadStatus Script Found");
  // GET ELEMENT IDs
  var GMNUnloaded = document.getElementById(
    "GMN_x0020_Unloaded_640a584b-a900-4f73-95dd-506112f92637_$TextField"
  );
  var TransferredGMN = document.getElementById(
    "Transferred_x0020_GMN_03405864-fdd5-4b70-8b6e-ebd3c03dd11b_$TextField"
  );
  var TransferredFromTank = document.getElementById(
    "TransferredFromTank_b5799811-59bb-419e-9dcd-5b2df27cdd7e_$TextField"
  );
  var ContainerID = document.getElementById(
    "Container_x0020_ID_081a421a-cea9-4d8a-96ee-468a5d92a5b9_$TextField"
  );
  var UnloadedtoTank = document.getElementById(
    "Unloaded_x0020_to_x0020_Tank_e6e13615-03be-4ef4-adbc-11bfee37da22_$TextField"
  );
  var ShippingWeight = document.getElementById(
    "ShippingWeight_cdef0bed-6da1-4592-82c5-cbe368abfc79_$NumberField"
  );
  var RecievedFrom = document.getElementById(
    "ReceivedFrom_975707ed-e5df-459a-9292-fd058c5226a1_$TextField"
  );
  var TankLoss = document.getElementById(
    "TankLoss_52755776-348f-4ab7-a81a-c9680ed9503b_$NumberField"
  );
  var TransferredToTank = document.getElementById(
    "TransferredToTank_e7782487-692b-4670-89f2-a8537386a04b_$TextField"
  );
  var Released = document.getElementById(
    "Released_c820649c-3610-4561-ad36-0c3f7c09dcd9_$BooleanField"
  );
  var ReasonNotReleasedID = document.getElementById(
    "ReasonNotReleased_6610fb4e-bee9-43cd-8c10-4ff1ffb9665b_$DropDownChoice"
  );
  var Posted = document.getElementById(
    "Posted_b521ca3c-a225-4585-9aa2-3d4984cd88f1_$BooleanField"
  );
  var ReasonNotPosted = document.getElementById(
    "ReasonNotPosted_58cb3d14-1df2-453e-bdaf-859cf1052bf8_$DropDownChoice"
  );
  var DocumentNumber = document.getElementById(
    "Document_x0020_Number_b1537d42-ecbd-462d-a7fb-e2b7439fed71_$TextField"
  );
  var Notes = document.getElementById(
    "Notes_9a8d4f34-696b-49be-a64e-e109b6cc6ed1_$TextField"
  );
  var MovementType = document.getElementById(
    "MovementType_6a4fe6f9-0d5e-4ec1-bf49-23d20d63daf8_$DropDownChoice"
  );

  if (GMNUnloaded != null) {
    document.getElementById("LoadingComments").innerText =
      "Preparing Unload Form";
    SetContainerType();
    ShippingWeightDynamics();
    ReleasedDynamics();
    UnloadDynamics();
    P1225NZUnload();
  }
  if (TransferredGMN != null) {
    document.getElementById("LoadingComments").innerText =
      "Preparing Transfer Form";
    SetValue(MovementType, "TRANSFER");
    HideField("FromTank");
    TankLossDynamics();
    TransferDynamics();
  }
  // HIDE RIBBON MENU
  document.getElementById("s4-ribbonrow").style.display = "none";
  document.getElementById("s4-workspace").style.overflowX = "hidden";
  PostedDynamics();

  // HIDE GMN,TO TANK, AND MOVEMENT TYPE FIELDS
  HideField("GMN");
  HideField("ToTank");
  HideField("MovementType");
  document.getElementById("LoadingComments").innerText = "Form is Ready";

  // REMOVE LOADER
  document.getElementById("Loader").style.display = "none";
  if (document.getElementById("MSOZoneCell_WebPartWPQ3") != null) {
    document.getElementById("MSOZoneCell_WebPartWPQ3").style.display =
      "inline-table";
    document.getElementById("MSOZoneCell_WebPartWPQ3").style.opacity = 1;
  }
  if (document.getElementById("MSOZoneCell_WebPartWPQ4") != null) {
    document.getElementById("MSOZoneCell_WebPartWPQ4").style.display =
      "inline-table";
    document.getElementById("MSOZoneCell_WebPartWPQ4").style.opacity = 1;
  }

  // ADD EVENT LISTENERS TO FIELDS FOR UNLOADS
  if (GMNUnloaded != null) {
    GMNUnloaded.addEventListener("input", GMNDynamics);
    GMNUnloaded.addEventListener("input", P1225NZUnload);
    ContainerID.addEventListener("input", SetContainerType);
    UnloadedtoTank.addEventListener("input", UnloadDynamics);
    RecievedFrom.addEventListener("change", ReceivedFromFormatting);
    ShippingWeight.addEventListener("change", ShippingWeightDynamics);
    Released.addEventListener("change", ReleasedDynamics);
    ReasonNotReleasedID.addEventListener("change", ReleasedDynamics);
    DocumentNumber.addEventListener("input", SetContainerType);
    Notes.addEventListener("input", PostedDynamics);
  }
  // ADD EVENT LISTENERS TO FIELDS FOR TRANSFERS
  if (TransferredGMN != null) {
    TransferredGMN.addEventListener("input", GMNDynamics);
    TankLoss.addEventListener("input", TankLossDynamics);
    TransferredGMN.addEventListener("input", TransferDynamics);
    TransferredFromTank.addEventListener("input", TransferDynamics);
    TransferredToTank.addEventListener("input", TransferDynamics);
  }
  // ADD EVENT LISTENER FOR POSTED FIELD
  Posted.addEventListener("change", PostedDynamics);
  ReasonNotPosted.addEventListener("input", PostedDynamics);
}

function GMNDynamics() {
  var GMNUnloaded = document.getElementById(
    "GMN_x0020_Unloaded_640a584b-a900-4f73-95dd-506112f92637_$TextField"
  );
  var TransferredGMN = document.getElementById(
    "Transferred_x0020_GMN_03405864-fdd5-4b70-8b6e-ebd3c03dd11b_$TextField"
  );
  var GMN = document.getElementById(
    "GMN_9293379f-71d3-41e9-8dac-ad5d33215a5b_$LookupField"
  );
  var SetGMN;
  // RESET DYNAMIC CONTENT
  RemoveElement("Dynamic");
  // FORCE FORMATTING FOR GMN
  GMNUnloaded.value = GMNUnloaded.value.toUpperCase();
  // RESET GMN LOOK-UP FIELD
  SetValue(GMN, "(None)");
  // CHECK GMN FOR PROPER FORMATTING FOR UNLOADS
  if (GMNUnloaded != null) {
    SetGMN = GMNUnloaded;
  } else {
    SetGMN = TransferredGMN;
  }
  if (
    (SetGMN.value.startsWith("P") || SetGMN.value.startsWith("S")) &&
    SetGMN.value.length == 8
  ) {
    // FIND GMN FROM GMN LIST ON SHAREPOINT
    SetValue(GMN, SetGMN.value);
    // GMN FOUND
    if (GMN.value != "0") {
      SetGMN.style.backgroundColor = "rgba(0,134,81,0.3)";
    } else {
      SetGMN.style.backgroundColor = "rgba(217,26,58,0.3)";
      SetGMN.style.display = "inline";
      SetGMN.insertAdjacentHTML(
        "afterend",
        "<h3 id=Dynamic style='color:red; display:inline;'> NOT FOUND</h3>"
      );
    }
  } else {
    if (SetGMN.value == "") {
      SetGMN.style.backgroundColor = "#fff";
    } else {
      SetGMN.style.backgroundColor = "rgba(217,26,58,0.3)";
      SetValue(GMN, "(None)");
      SetGMN.insertAdjacentHTML(
        "afterend",
        "<h3 id=Dynamic style='color:red; display:inline;'> CHECK FORMATTING</h3>"
      );
    }
  }
}

function ReceivedFromFormatting() {
  var RecievedFrom = document.getElementById(
    "ReceivedFrom_975707ed-e5df-459a-9292-fd058c5226a1_$TextField"
  );
  var From = RecievedFrom.value.toLowerCase().split(" ");
  // CHECKED FOR COMMON TYPO'S AND CORRECTED THEM (PROTECTING EMN SUPPLIERS LIST)
}

function ShippingWeightDynamics() {
  var ShippingWeight = document.getElementById(
    "ShippingWeight_cdef0bed-6da1-4592-82c5-cbe368abfc79_$NumberField"
  );
  var ScaleGaugeWeight = document.getElementById(
    "ScaleWeight_17273790-6dbc-41bd-a9c0-383f3b874ab9_$NumberField"
  );
  // ADD LB TO SHIPPING WEIGHT AND SCALE/GAUGE WEIGHT
  if (document.getElementById("LB") == null) {
    ShippingWeight.style.display = "inline";
    ShippingWeight.insertAdjacentHTML(
      "afterend",
      "<p style='display:inline'> LBs</p>"
    );
    ScaleGaugeWeight.style.display = "inline";
    ScaleGaugeWeight.insertAdjacentHTML(
      "afterend",
      "<p style='display:inline'> LBs</p>"
    );
  }
  // SET SCALE/GAUGE WEIGHT EQUAL TO SHIPPING WEIGHT
  if (ShippingWeight.value != "" && ScaleGaugeWeight.value == "") {
    ScaleGaugeWeight.value = ShippingWeight.value;
  }
}

function SetContainerType() {
  var GMNUnloaded = document.getElementById(
    "GMN_x0020_Unloaded_640a584b-a900-4f73-95dd-506112f92637_$TextField"
  );
  var ContainerType = document.getElementById(
    "ContainerType_4028148d-7b46-4f38-abb3-eb95b88a24cf_$DropDownChoice"
  );
  var ContainerID = document.getElementById(
    "Container_x0020_ID_081a421a-cea9-4d8a-96ee-468a5d92a5b9_$TextField"
  );
  var DocumentNumber = document.getElementById(
    "Document_x0020_Number_b1537d42-ecbd-462d-a7fb-e2b7439fed71_$TextField"
  );
  // FORCE FORMATTING FOR CONTAINER ID
  ContainerID.value = ContainerID.value.replace(/\s/g, "");
  ContainerID.value = ContainerID.value.toUpperCase();
  // INSERT CONTAINER TYPE BESIDE CONTAINER ID
  InsertBeside(ContainerID, "", ContainerType);
  var ContainerTypeCopy = document.getElementById("ContainerTypeCopy");
  // SET CONTAINER TYPE AND SHOW DOCUMENT NUMBER IF RAILCAR
  if (ContainerID.value.indexOf("X") == 3) {
    ShowField("Document_x0020_Number");
    SetValue(ContainerTypeCopy, "Railcar");
    SetValue(ContainerType, "Railcar");
    if (DocumentNumber.value.length != 10) {
      DocumentNumber.style.borderColor = "red";
      DocumentNumber.style.backgroundColor = "rgba(217,26,58,0.3)";
    } else {
      DocumentNumber.style.borderColor = "#ababab";
      DocumentNumber.style.backgroundColor = "#fff";
    }
  } else {
    if (ContainerID.value[3] == "U") {
      SetValue(ContainerTypeCopy, "Isotainer");
      SetValue(ContainerType, "Isotainer");
    } else {
      HideField("Document_x0020_Number");
      SetValue(ContainerTypeCopy, "Trailer");
      SetValue(ContainerType, "Trailer");
      if (GMNUnloaded.value == "P01225NZ") {
        document.getElementById("ContainerTypeCopy").disabled = true;
      }
    }
  }
  if (ContainerType == "Trailer" || ContainerType == "Isotainer") {
    HideField("ReasonNotPosted");
  }
}

function UnloadDynamics() {
  console.log("UnloadDynamics Script Found");
  var UnloadedToTank = document.getElementById(
    "Unloaded_x0020_to_x0020_Tank_e6e13615-03be-4ef4-adbc-11bfee37da22_$TextField"
  );
  var ToTank = document.getElementById(
    "ToTank_b2043e4f-6ffa-42c2-b916-a4b6ff90b2af_$LookupField"
  );
  // RESET DYNAMIC CONTENT
  RemoveElement("TankDynamic");
  // FORCE FORMATTING FOR GMN UNLOADED, CONTAINER, AND TANK
  UnloadedToTank.value = UnloadedToTank.value.toUpperCase();

  // DETERMINE TANK BASED ON UNLOADED TO TANK VALUE
  if (UnloadedToTank.value.indexOf(",") != -1) {
    var comma = UnloadedToTank.value.indexOf(",");
    var Tank = UnloadedToTank.value.substring(0, comma);
  } else {
    Tank = UnloadedToTank.value;
  }
  // REMOVE UNLOADED TO TANK FIELD FORMATTING IF BLANK
  if (UnloadedToTank.value == "") {
    UnloadedToTank.style.backgroundColor = "#fff";
  }
}

function TransferDynamics() {
  console.log("TransferDynamics Script Found");
  var TransferredFromTank = document.getElementById(
    "TransferredFromTank_b5799811-59bb-419e-9dcd-5b2df27cdd7e_$TextField"
  );
  var FromTank = document.getElementById(
    "FromTank_20a0e313-4536-4fce-be8a-3dfa90d42746_$LookupField"
  );
  var ToTankID = document.getElementById(
    "ToTank_b2043e4f-6ffa-42c2-b916-a4b6ff90b2af_$LookupField"
  );
  var TransferredToTank = document.getElementById(
    "TransferredToTank_e7782487-692b-4670-89f2-a8537386a04b_$TextField"
  );
  // RESET DYNAMIC ADD-ONS
  if (document.getElementById("TankDynamic") != null) {
    document
      .getElementById("TankDynamic")
      .parentElement.removeChild(document.getElementById("TankDynamic"));
  }
  // DETERMINE TANK BASED ON TRANSFERRED FROM TANK VALUE
  TransferredFromTank.value = TransferredFromTank.value.toUpperCase();
  if (TransferredFromTank.value.indexOf(",") != -1) {
    var comma = TransferredFromTank.value.indexOf(",");
    var FromTank = TransferredFromTank.value.substring(0, comma);
  } else {
    FromTank = TransferredFromTank.value;
  }
  // SET FROM TANK LOOK-UP VALUE
  SetValue(FromTank, "(None)"); // RESET VALUE FROM NONE
  SetValue(FromTank, FromTank);
  // FORMAT TRANSFERRED FROM TANK FIELD BASED ON IF TANK IS FOUND ON SHAREPOINT LIST
  if (FromTank.value != "0") {
    TransferredFromTank.style.backgroundColor = "rgba(0,134,81,0.3)";
  } else {
    if (TransferredFromTank.value != "") {
      TransferredFromTank.style.backgroundColor = "rgba(217,26,58,0.3)";
      TransferredFromTank.style.display = "inline";
      TransferredFromTank.insertAdjacentHTML(
        "afterend",
        "<h3 id=TankDynamic style='color:red; display:inline;'> NOT FOUND</h3>"
      );
    }
  }
  // REMOVE TRANSFERRED FROM TANK FIELD FORMATTING IF BLANK
  if (TransferredFromTank.value == "") {
    TransferredFromTank.style.backgroundColor = "#fff";
  }
  // DETERMINE TANK BASED ON TRANSFERRED TO TANK VALUE
  TransferredToTank.value = TransferredToTank.value.toUpperCase();
  if (TransferredToTank.value.indexOf(",") != -1) {
    var comma = TransferredToTank.value.indexOf(",");
    var ToTank = TransferredToTank.value.substring(0, comma);
  } else {
    ToTank = TransferredToTank.value;
  }
  // SET TO TANK LOOK-UP VALUE
  SetValue(ToTankID, "(None)"); // RESET VALUE TO NONE
  SetValue(ToTankID, ToTank);
  // FORMAT TRANSFERRED TO TANK FIELD BASED ON IF TANK IS FOUND ON SHAREPOINT LIST
  if (ToTankID.value != "0") {
    TransferredToTank.style.backgroundColor = "rgba(0,134,81,0.3)";
  } else {
    if (TransferredToTank.value != "") {
      TransferredToTank.style.backgroundColor = "rgba(217,26,58,0.3)";
      TransferredToTank.style.display = "inline";
      TransferredToTank.insertAdjacentHTML(
        "afterend",
        "<h3 id=TankDynamic style='color:red; display:inline;'> NOT FOUND</h3>"
      );
    }
  }
  // REMOVE TRANSFERRED TO TANK FIELD FORMATTING IF BLANK
  if (TransferredToTank.value == "") {
    TransferredToTank.style.backgroundColor = "#fff";
  }
}

function TankLossDynamics() {
  var TankLoss = document.getElementById(
    "TankLoss_52755776-348f-4ab7-a81a-c9680ed9503b_$NumberField"
  );
  var TankGain = document.getElementById(
    "TankGain_578b51c8-4856-4b20-8cbd-66a47ac3b58c_$NumberField"
  );
  // ADD LB TO TANK LOSS AND TANK GAIN
  if (document.getElementById("LB") == null) {
    TankLoss.style.display = "inline";
    TankLoss.insertAdjacentHTML(
      "afterend",
      "<p id=LB class=ms-h3, ms-standardheader style='display:inline'> LBs</p>"
    );
    TankGain.style.display = "inline";
    TankGain.insertAdjacentHTML(
      "afterend",
      "<p class=ms-h3, ms-standardheader style='display:inline'> LBs</p>"
    );
  }
  // SET TANK GAIN EQUAL TO TANK LOSS
  TankGain.value = TankLoss.value;
}

function CopyContainerType() {
  var ContainerType = document.getElementById(
    "ContainerType_4028148d-7b46-4f38-abb3-eb95b88a24cf_$DropDownChoice"
  );
  var ContainerTypeCopy = document.getElementById("ContainerTypeCopy");

  SetValue(ContainerType, ContainerTypeCopy.value);
}

function ReleasedDynamics() {
  // SHOW OR HIDE REASON NOT RELEASED
  var Released = document.getElementById(
    "Released_c820649c-3610-4561-ad36-0c3f7c09dcd9_$BooleanField"
  );
  var ReasonNotReleased = document.getElementById(
    "ReasonNotReleased_6610fb4e-bee9-43cd-8c10-4ff1ffb9665b_$DropDownChoice"
  );
  if (Released.checked === true) {
    HideField("ReasonNotReleased");
    SetValue(ReasonNotReleased, "");
  } else {
    ShowField("ReasonNotReleased");
    if (ReasonNotReleased.value == "") {
      ReasonNotReleased.style.borderColor = "red";
    } else {
      ReasonNotReleased.style.borderColor = "#ababab";
    }
  }
}

function PostedDynamics() {
  // SHOW OR HIDE REASON NOT POSTED
  var Posted = document.getElementById(
    "Posted_b521ca3c-a225-4585-9aa2-3d4984cd88f1_$BooleanField"
  );
  var ReasonNotPosted = document.getElementById(
    "ReasonNotPosted_58cb3d14-1df2-453e-bdaf-859cf1052bf8_$DropDownChoice"
  );
  var MovementType = document.getElementById(
    "MovementType_6a4fe6f9-0d5e-4ec1-bf49-23d20d63daf8_$DropDownChoice"
  ).value;
  var Notes = document.getElementById(
    "Notes_9a8d4f34-696b-49be-a64e-e109b6cc6ed1_$TextField"
  );
  if (Posted.checked === true) {
    HideField("ReasonNotPosted");
    SetValue(ReasonNotPosted, "");
    RemoveElement("Text");
    if (MovementType == "UNLOAD") {
      Notes.style.borderColor = "#ababab";
    }
  }
  if (MovementType == "UNLOAD" && Posted.checked == false) {
    var ContainerType = document.getElementById(
      "ContainerType_4028148d-7b46-4f38-abb3-eb95b88a24cf_$DropDownChoice"
    ).value;
    HideField("ReasonNotPosted");
    if (Notes.value == "" && ContainerType != "Trailer") {
      Notes.style.borderColor = "red";
      InsertBeside(Posted, "Notes are Required if Not Posted", "");
      document.getElementById("Text").style.color = "red";
      document.getElementById("Text").style.textTransform = "uppercase";
    } else {
      Notes.style.borderColor = "#ababab";
    }
  }
  if (MovementType == "TRANSFER" && Posted.checked == false) {
    ShowField("ReasonNotPosted");
    if (ReasonNotPosted.value == "") {
      ReasonNotPosted.style.borderColor = "red";
    } else {
      ReasonNotPosted.style.borderColor = "#ababab";
    }
  }
}

function P1225NZUnload() {
  const GMNUnloaded = document.getElementById(
    "GMN_x0020_Unloaded_640a584b-a900-4f73-95dd-506112f92637_$TextField"
  );
  const RecievedFrom = document.getElementById(
    "ReceivedFrom_975707ed-e5df-459a-9292-fd058c5226a1_$TextField"
  );
  const ShippingWeight = document.getElementById(
    "ShippingWeight_cdef0bed-6da1-4592-82c5-cbe368abfc79_$NumberField"
  );
  const ScaleGaugeWeight = document.getElementById(
    "ScaleWeight_17273790-6dbc-41bd-a9c0-383f3b874ab9_$NumberField"
  );
  const UnloadedToTank = document.getElementById(
    "Unloaded_x0020_to_x0020_Tank_e6e13615-03be-4ef4-adbc-11bfee37da22_$TextField"
  );
  const Posted = document.getElementById(
    "Posted_b521ca3c-a225-4585-9aa2-3d4984cd88f1_$BooleanField"
  );

  if (GMNUnloaded.value == "P1225" || GMNUnloaded.value == "1225") {
    GMNUnloaded.value = "P01225NZ";
  }
  if (GMNUnloaded.value == "P01225NZ") {
    UnloadedToTank.value = "M-5";
    ReadONLY("Unloaded_x0020_to_x0020_Tank");
    document.getElementById("ContainerTypeCopy").disabled = true;
    ShippingWeight.value = "46,500";
    ScaleGaugeWeight.value = "46,500";
    RecievedFrom.value = "RESTRICTED";
    ReadONLY("ReceivedFrom");
    HideField("ShippingWeight");
    HideField("Released");
    Posted.disabled = true;
    GMNDynamics();
    UnloadDynamics();
  }
}
