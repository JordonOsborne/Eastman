function WarehouseEvents() {
  Tote;
  const ViewDiv = document.getElementById("View");
  if (IEBrowser()) {
    alert(
      "This WebPage is not fully supported in Internet Explorer. For a better, faster experience please use Chrome or other modernized Brower."
    );
    RunIEVersion();
  }
  GetDateTime();
  GetSPData();
  document.getElementById("Submit").addEventListener("click", GetInputData);
  document.getElementById("UOM").addEventListener("change", function () {
    ViewIn(this.value);
  });
  document.getElementById("Save").addEventListener("click", SaveReport);
  document.getElementById("Print").addEventListener("click", PrintReport);
  document
    .getElementById("PrintBlank")
    .addEventListener("click", PrintBlankReport);
  // ADD BUTTON DIALOG FUNCTIONS
  document.getElementById("AddPZ").addEventListener("click", function () {
    OpenDialog(
      "/sites/MIS/Lists/WarehouseInventory/NewForm.aspx",
      "New Warehouse Plasticizer GMN",
      "PZ"
    );
  });
  document.getElementById("AddAOX").addEventListener("click", function () {
    OpenDialog(
      "/sites/MIS/Lists/WarehouseInventory/NewForm.aspx",
      "New AOX Batch",
      "AOX"
    );
  });
  document.getElementById("AddFilter").addEventListener("click", function () {
    OpenDialog(
      "/sites/MIS/Lists/WarehouseInventory/NewForm.aspx",
      "New Warehouse Filter Material",
      "Filters"
    );
  });
  document
    .getElementById("AddSampleBottle")
    .addEventListener("click", function () {
      OpenDialog(
        "/sites/MIS/Lists/WarehouseInventory/NewForm.aspx",
        "New Warehouse Sample Bottle",
        "Sample Bottles"
      );
    });
  document
    .getElementById("AddBlockedStock")
    .addEventListener("click", function () {
      OpenDialog(
        "/sites/MIS/Lists/WarehouseInventory/NewForm.aspx",
        "New Warehouse Off Quality/Damaged Material",
        "Blocked Stock"
      );
    });
  document.getElementById("AddTote").addEventListener("click", function () {
    OpenDialog(
      "/sites/MIS/Lists/WarehouseInventory/NewForm.aspx",
      "New Tote Tote Batch",
      "Tote"
    );
  });
  // ADD EVENTLISTNER FOR Tote TOTE INVENTORY TAB
  document
    .getElementById("View")
    .lastElementChild.addEventListener("click", GetToteData);
  document.getElementById("SendTotes").addEventListener("click", SendTotes);
  document
    .getElementById("ReceiveTotes")
    .addEventListener("click", RecieveTotes);
  // PAGE NAVIGATION FUNCTIONS
  ShowTables();
  for (i in ViewDiv.children) {
    try {
      if (!isNaN(i)) {
        document
          .getElementById("View")
          .children[i].addEventListener("click", ChangeView);
      }
    } catch (Error) {}
  }
  ChangeView("Warehouse Summary");
  setTimeout(function () {
    // GET INVENTORY TOTALS FOR BULK GMNS
    SetPZSLocListeners();
    SetAOXBatchListeners();
  }, 3000);
}
/*=======================================================================
PAGE VIEW OPTION FUNCTIONS
=======================================================================*/
function ChangeView(SelectedView) {
  const ViewDiv = document.getElementById("View");
  if (SelectedView != "Warehouse Summary") {
    SelectedView = this.innerText;
  }
  CreateView(SelectedView);
  for (i in ViewDiv.children) {
    try {
      if (IEBrowser()) {
        if (ViewDiv.children[i].innerText == SelectedView) {
          ViewDiv.children[i].classList.add("Selected");
        } else {
          ViewDiv.children[i].className = "";
        }
      } else {
        ViewDiv.children[i].removeAttribute("id");
        if (ViewDiv.children[i].innerText === SelectedView) {
          ViewDiv.children[i].id = "Selected";
        }
      }
    } catch (Error) {}
  }
}

function CreateView(SelectedView) {
  let Sections, Section;
  if (IEBrowser()) {
    Sections = {
      0: document.getElementById("PZ"),
      1: document.getElementById("AOX"),
      2: document.getElementById("Filters"),
      3: document.getElementById("SampleBottles"),
      4: document.getElementById("BlockedStock"),
      5: document.getElementById("Tote"),
      6: document.getElementById("ToteWithSupplier"),
    };
  } else {
    Sections = document.getElementsByTagName("section");
  }
  Views = {
    "Warehouse Summary": [
      "PZ",
      "AOX",
      "Filters",
      "SampleBottles",
      "BlockedStock",
    ],
    "SAP Inventory": ["PZ", "AOX", "BlockedStock"],
    "Filter Inventory": ["Filters"],
    "Sample Bottles": ["SampleBottles"],
    "Off Quality/Damaged": ["BlockedStock"],
    "Tote Inventory": ["Tote", "ToteWithSupplier"],
  };
  // HIDE ALL SECTIONS
  for (i in Sections) {
    try {
      if (!isNaN(i)) {
        Section = Sections[i].id;
        document.getElementById(Section).style.display = "none";
      }
    } catch (Error) {}
  }
  // SHOW SELECTED SECTIONS
  let ShowViews = Views[SelectedView];
  for (i = 0; i < ShowViews.length; i++) {
    try {
      Section = ShowViews[i];
      document.getElementById(Section).style.display = "block";
    } catch (Error) {}
    if (SelectedView == "Tote Inventory") {
      document.getElementById("ToteWithSupplier").style.display = "block";
      CountToteTotes();
    }
  }
}

function ShowTables() {
  let Tables = [
    "PZ",
    "AOX",
    "Filters",
    "SampleBottles",
    "BlockedStock",
    "Tote",
    "ToteWithSupplier",
  ];
  for (i = 0; i < Tables.length; i++) {
    let Table = document.getElementById(Tables[i] + "Header").parentElement;
    if (Table.children.length > 1) {
      document.getElementById(Table[i] + "Table").style.display = "table";
      document.getElementById(Table[i] + "Table").style.opacity = 1;
    }
  }
}

function ViewIn(UOM) {
  let UnitQty, Inventory, Minimum;
  UOM = UOM.replace("s", "");
  const Tables = {
    PZ: document.getElementById("PZTable"),
    AOX: document.getElementById("AOXTable"),
    BlockedStock: document.getElementById("BlockedStockTable"),
  };
  for (Section in Tables) {
    let Rows = Tables[Section].children[0].children;
    for (i in Rows) {
      try {
        if (!isNaN(i) && i != 0) {
          UnitQty = Rows[i].children[4];
          Inventory = Rows[i].children[6];
          Minimum = Rows[i].children[7];
          if (UOM === "KG") {
            if (!isNaN(parseInt(UnitQty.innerText))) {
              UnitQty.innerText =
                ConvertLBtoKG(parseFloat(UnitQty.innerText.replace(",", ""))) +
                " KG";
            }
            if (!isNaN(parseInt(Inventory.innerText))) {
              Inventory.innerText =
                ConvertLBtoKG(
                  parseFloat(Inventory.innerText.replace(",", ""))
                ) + " KG";
            }
            if (!isNaN(parseInt(Minimum.innerText))) {
              Minimum.innerText =
                ConvertLBtoKG(parseFloat(Minimum.innerText.replace(",", ""))) +
                " KG";
            }
          } else {
            if (!isNaN(parseInt(UnitQty.innerText))) {
              UnitQty.innerText =
                ConvertKGtoLB(parseFloat(UnitQty.innerText.replace(",", ""))) +
                " LB";
            }
            if (!isNaN(parseInt(Inventory.innerText))) {
              Inventory.innerText =
                ConvertKGtoLB(
                  parseFloat(Inventory.innerText.replace(",", ""))
                ) + " LB";
            }
            if (!isNaN(parseInt(Minimum.innerText))) {
              Minimum.innerText =
                ConvertKGtoLB(parseFloat(Minimum.innerText.replace(",", ""))) +
                " LB";
            }
          }
        }
      } catch (Error) {}
    }
  }
}

function ConvertLBtoKG(LBs) {
  let KG = LBs * 0.453592;
  return KG.toLocaleString();
}

function ConvertKGtoLB(KGs) {
  let LB = KGs / 0.453592;
  return Math.round(LB).toLocaleString();
}
/*=======================================================================
BUILD PAGE TABLE FUNCTIONS
=======================================================================*/
function GetSPData() {
  console.log("Getting Data from SharePoint");
  let QueryFilter = {
    Inactive: { Type: "Integer", Value: 0, FilterType: "Eq" },
    Category: { Type: "Text", Value: "Tote", FilterType: "Neq" },
  };
  let Return = [
    "ID",
    "LoadOrder",
    "Category",
    "Title",
    "Description",
    "Batch",
    "SL",
    "UnitType",
    "DrumType",
    "UnitUOM",
    "UnitQty",
    "Units",
    "PITag",
    "Inventory",
    "Minimum",
    "SupplyPlanner",
    "Comments",
    "SentToPI",
  ];
  let OrderBy = {
    LoadOrder: { Column: "LoadOrder", Ascending: true },
    GMN: { Column: "Title", Ascending: true },
    Location: { Column: "SL", Ascending: true },
    Batch: { Column: "Batch", Ascending: true },
  };
  FindListItem("Warehouse Inventory", QueryFilter, Return, OrderBy);
}

function GetToteData() {
  console.log("Getting Tote Data from SharePoint");
  let Delay = 3000;
  let QueryFilter = {
    Category: { Type: "Text", Value: "Tote", FilterType: "Eq" },
  };
  let Return = [
    "ID",
    "LoadOrder",
    "Category",
    "Title",
    "Description",
    "Batch",
    "SL",
    "UnitType",
    "DrumType",
    "UnitUOM",
    "UnitQty",
    "Units",
    "PITag",
    "Inventory",
    "Minimum",
    "SupplyPlanner",
    "Comments",
    "Inactive",
  ];
  let OrderBy = {
    LoadOrder: { Column: "LoadOrder", Ascending: true },
    Batch: { Column: "Batch", Ascending: true },
  };
  FindListItem("Warehouse Inventory", QueryFilter, Return, OrderBy);
  setTimeout(CountToteTotes, Delay);
}

function WriteToTable(Item) {
  let Section = Item.Category,
    Cell = {},
    Planner,
    PlannerName,
    PlannerNameKey,
    PlannerEmailKey,
    PlannerEmail,
    TableRow;
  let Header = document.getElementById(Section.replace(" ", "") + "Header");
  try {
    if (Item.SupplyPlanner != null) {
      Planner = Item.SupplyPlanner[0];
      // GET PLANNER NAME
      PlannerNameKey = Object.keys(Planner)[1];
      PlannerName = Planner[PlannerNameKey];
      PlannerName = PlannerName.replace("- Contractor", "");
      PlannerName =
        PlannerName.substring(PlannerName.indexOf(",") + 1) +
        " " +
        PlannerName.substring(0, PlannerName.indexOf(","));
      // GET PLANNER EMAIL
      PlannerEmailKey = Object.keys(Planner)[2];
      PlannerEmail = Planner[PlannerEmailKey];
      Item.SupplyPlanner =
        '<a title="Send E-mail" href="MailTo:' +
        PlannerEmail +
        "?subject=Inventory is Low for " +
        Item.Title +
        " - " +
        Item.Description +
        '" tabindex=-1>' +
        PlannerName +
        "</a>";
    } else {
      Item.SupplyPlanner = null;
    }
  } catch (Error) {
    console.log(Error);
    Item.SupplyPlanner = null;
  }
  // CREATE CELLS
  if (Item.Units === null) {
    Item.Units = 0;
  }
  for (i in Item) {
    try {
      if (Item[i] === null) {
        Item[i] = "";
      }
    } catch (Error) {
      console.log(Error);
    }
  }
  Cell = {
    GMN: "<td>" + Item.Title + "</td>",
    Description:
      "<td><div class=hide-overflow style=justify-content:flex-start;>" +
      Item.Description +
      "</div></td>",
    Batch: "<td>" + Item.Batch + "</td>",
    SL: "<td>" + Item.SL + "</td>",
    DrumType: "<td>" + Item.DrumType + "</td>",
    UnitType: "<td>" + Item.UnitType + "</td>",
    UnitQty:
      "<td>" + Item.UnitQty.toLocaleString() + " " + Item.UnitUOM + "</td>",
    Inventory:
      "<td>" + Item.Inventory.toLocaleString() + " " + Item.UnitUOM + "</td>",
    Minimum: "<td>" + Item.Minimum.toLocaleString() + " LB</td>",
    SupplyPlanner:
      "<td><div class=hide-overflow>" + Item.SupplyPlanner + "</div></td>",
    Comments: "<td><div>" + Item.Comments + "</div></td>",
  };
  if (Item.Category == "Filters" || Item.Category == "Sample Bottles") {
    Cell.Minimum = "<td>" + Item.Minimum.toLocaleString() + " EA</td>";
  }
  if (Item.UnitQty == "") {
    Cell.UnitQty = "<td></td>";
  }
  if (Item.PITag !== "") {
    Cell.Units =
      "<td><span><input type=number id=" +
      Item.PITag +
      ' data-last_Sent="' +
      Item.SentToPI +
      '" placeholder=' +
      Item.Units.toLocaleString() +
      " title=" +
      Item.PITag +
      " required></span></td>";
  } else {
    Cell.Units =
      "<td><span><input type=number id=" +
      Item.ID +
      "_Units placeholder=" +
      Item.Units.toLocaleString() +
      " value></span></td>";
  }
  if (Item.Category == "Tote") {
    Cell.Units = "<td><select name=FULL/EMPTY id=" + Item.ID + "_Units >";
    if (Item.Units == 1) {
      Cell.Units += "<option value=Full selected>FULL</option>";
      Cell.Units += "<option value=Empty>EMPTY</option>";
    } else {
      Cell.Units += "<option value=Full>FULL</option>";
      Cell.Units += "<option value=Empty selected>EMPTY</option>";
    }
    Cell.Units += "</select></td>";
    if (Item.Inactive === true) {
      Cell.Units = "<td>EMPTY</td>";
    }
    Cell.Inactive =
      "<td class=checkbox><input type=checkbox id=" +
      Item.ID +
      "_Inactive ><label for=" +
      Item.ID +
      "_Inactive></label></td>";
  }
  if (Item.Minimum == "") {
    Cell.Minimum = "<td></td>";
  }
  // CREATE TABLE ROW BASED OFF CELLS
  TableRow = "<tr id=" + Item.ID + ">" + Cell.GMN;
  TableRow += Cell.Description;
  if (Section === "PZ") {
    TableRow += Cell.SL;
  }
  if (Section === "AOX" || Section === "Blocked Stock" || Section === "Tote") {
    TableRow += Cell.Batch;
  }
  if (Section != "Tote") {
    if (Section == "Blocked Stock") {
      TableRow += Cell.DrumType;
    } else {
      TableRow += Cell.UnitType;
    }
    TableRow += Cell.UnitQty;
    TableRow += Cell.Units;
    TableRow += Cell.Inventory;
    if (Section != "Blocked Stock") {
      TableRow += Cell.Minimum;
    }
    if (Section == "PZ" || Section == "AOX") {
      TableRow += Cell.SupplyPlanner;
    } else {
      TableRow += Cell.Comments;
    }
  } else {
    TableRow += Cell.Units;
    TableRow += Cell.Comments;
    TableRow += Cell.Inactive;
    if (Item.Inactive === true) {
      Header = document.getElementById("ToteWithSupplierHeader");
    }
  }
  TableRow += "</tr>";
  // ADD OR UPDATE ROW INFO
  if (document.getElementById(Item.ID) == null) {
    Header.parentElement.insertAdjacentHTML("beforeend", TableRow);
  } else {
    // UPDATE TABLE ROWS ON QUERY REFRESH
    document.getElementById(Item.ID).outerHTML = TableRow;
  }
  // ADD STYLING AND LINK ACTIONS
  TableRow = document.getElementById(Item.ID);
  if (Section != "Tote") {
    StyleBulk(Item);
    StyleMinimum(Item);
  } else {
    TableRow.children[5].children[0].addEventListener("change", ToteSelected);
    if (Item.Inactive === false) {
      TableRow.children[3].children[0].addEventListener(
        "change",
        CountToteTotes
      );
      TableRow.children[3].children[0].addEventListener(
        "change",
        UpdateToteStatus
      );
    } else {
      TableRow.children[3].children[0].disabled = true;
    }
  }
  if (Section == "Blocked Stock" || Section == "Tote") {
    AddEditLinkToBatchAndComments(Item);
  } else {
    AddEditLinkToGMNandDescription(Item);
  }
  for (i = 0; i < TableRow.children.length; i++) {
    try {
      TableRow.children[i].classList.add("small-cell");
      if (i === 1 || i === TableRow.children.length - 1) {
        TableRow.children[i].classList.remove("small-cell");
        TableRow.children[i].classList.add("large-cell");
      }
      if (Item.Category === "Tote" && i === TableRow.children.length - 1) {
        TableRow.children[i].classList.remove("large-cell");
      }
    } catch (Error) {}
  }
}

/*=======================================================================
TABLE STYLING FUNCTIONS
=======================================================================*/
function StyleMinimum(Item) {
  if (Item.Category != "BlockedStock") {
    const MinCell = document.getElementById(Item.ID).lastElementChild
      .previousElementSibling;
    const InvCell = MinCell.previousElementSibling;
    const SupplyPlannerCell = MinCell.nextElementSibling;
    const Minimum = Item.Minimum;
    const Inventory = Item.UnitQty * Item.Units;
    if (Inventory <= Minimum && Minimum != "") {
      InvCell.classList.add("LowInv");
      MinCell.classList.add("LowInv");
      SupplyPlannerCell.classList.add("LowInv");
    } else {
      InvCell.classList.remove("LowInv");
      MinCell.classList.remove("LowInv");
      SupplyPlannerCell.classList.remove("LowInv");
    }
  }
}

function StyleBulk(Item) {
  if (Item.Category == "PZ" || Item.Category == "AOX") {
    const Row = document.getElementById(Item.ID);
    const LocationOrBatch = Row.children[2].innerText;
    const UnitInput = Row.children[5].firstElementChild.firstElementChild;
    if (LocationOrBatch === "") {
      UnitInput.required = false;
      UnitInput.disabled = true;
      UnitInput.value = UnitInput.placeholder;
      Row.classList.add("Bulk");
    }
    if (Row.id == 6) {
      // Tote BULK FOR PZ INVENTORY
      UnitInput.disabled = true;
      UnitInput.value = UnitInput.placeholder;
      Row.classList.add("Bulk");
    }
  }
}

function AddEditLinkToBatchAndComments(Item) {
  const Section = Item.Category;
  const BatchCell = document.getElementById(Item.ID).children[2];
  let CommentsCell = BatchCell.parentElement.lastElementChild;
  if (Section === "Tote") {
    CommentsCell = CommentsCell.previousElementSibling;
  }
  const URL = "/sites/MIS/Lists/WarehouseInventory/EditForm.aspx?ID=" + Item.ID;
  BatchCell.classList.add("Link");
  BatchCell.addEventListener("click", function () {
    OpenDialog(
      URL,
      "Modify " + Section + " Batch " + BatchCell.innerText,
      Section
    );
  });
  CommentsCell.classList.add("Link");
  CommentsCell.addEventListener("click", function () {
    OpenDialog(
      URL,
      "Modify " + Section + " Batch " + BatchCell.innerText,
      Section
    );
  });
}

function AddEditLinkToGMNandDescription(Item) {
  const GMN = document.getElementById(Item.ID).children[0].innerText;
  const Section = Item.Category;
  const URL = "/sites/MIS/Lists/WarehouseInventory/EditForm.aspx?ID=" + Item.ID;
  const GMNCell = document.getElementById(Item.ID).children[0];
  GMNCell.classList.add("Link");
  GMNCell.addEventListener("click", function () {
    OpenDialog(URL, "Modify Warehouse GMN " + GMN + " Info", Section);
  });
  const DescriptionCell = document.getElementById(Item.ID).children[1];
  DescriptionCell.classList.add("Link");
  DescriptionCell.addEventListener("click", function () {
    OpenDialog(URL, "Modify Warehouse GMN " + GMN + " Info", Section);
  });
}
/*=======================================================================
BULK INVENTORY FUNCTIONS
=======================================================================*/
function SetPZSLocListeners() {
  let Row,
    Bulk = {},
    GMN,
    SL,
    Input;
  const Table = document.getElementById("PZTable").children[0];
  for (i in Table.children) {
    // FIND BULK GMN ROWS
    try {
      if (!isNaN(i)) {
        Row = Table.children[i];
        GMN = Row.children[0].innerText;
        SL = Row.children[2].innerText;
        if (SL === "") {
          Bulk[GMN] = Row.children[5].children[0].children[0];
        }
      }
    } catch (Error) {}
  }
  for (i in Table.children) {
    // ADD LISTENERS TO LOCATION ROWS
    try {
      if (!isNaN(i)) {
        Row = Table.children[i];
        GMN = Row.children[0].innerText;
        SL = Row.children[2].innerText;
        if (SL !== "" && i != 0) {
          Input = Row.children[5].children[0].children[0];
          SetListener(Input, Table, Bulk[GMN], GMN);
        }
      }
    } catch (Error) {}
  }
}

function SetAOXBatchListeners() {
  let Row,
    Bulk = {},
    GMN,
    Batch,
    Input;
  const Table = document.getElementById("AOXTable").children[0];
  for (i in Table.children) {
    // FIND BULK GMN ROWS
    try {
      if (!isNaN(i)) {
        Row = Table.children[i];
        GMN = Row.children[0].innerText;
        Batch = Row.children[2].innerText;
        if (Batch === "") {
          Bulk[GMN] = Row.children[5].children[0].children[0];
        }
      }
    } catch (Error) {}
  }
  for (i in Table.children) {
    // ADD LISTENERS TO BATCH ROWS
    try {
      if (!isNaN(i)) {
        Row = Table.children[i];
        GMN = Row.children[0].innerText;
        Batch = Row.children[2].innerText;
        if (Batch !== "" && i != 0) {
          Input = Row.children[5].children[0].children[0];
          SetListener(Input, Table, Bulk[GMN], GMN);
        }
      }
    } catch (Error) {}
  }
}

function SetListener(Input, Table, Bulk, GMN) {
  Input.addEventListener("change", function () {
    CountBulk(Table, Bulk, GMN);
  });
}

function CountBulk(Table, Bulk, GMN) {
  console.log("Counting Bulk for " + GMN);
  let Row,
    Placeholder,
    Input,
    RowGMN,
    RowBatchOrSL,
    Units = 0;
  for (i in Table.children) {
    try {
      if (!isNaN(i)) {
        Row = Table.children[i];
        RowGMN = Row.children[0].innerText;
        RowBatchOrSL = Row.children[2].innerText;
        if (RowGMN == GMN && RowBatchOrSL !== "") {
          Placeholder = Row.children[5].children[0].children[0].placeholder;
          Input = Row.children[5].children[0].children[0].value;
          if (Input == "") {
            Units = Units + parseInt(Placeholder);
          } else {
            Units = Units + parseInt(Input);
          }
        }
      }
    } catch (Error) {}
  }
  Bulk.value = Units;
  Bulk.style.fontWeight = "bold";
}

function CountToteTotes() {
  let ToteRow,
    SelectBox,
    Status,
    Full = 0,
    Empty = 0;
  const ToteTable = document.getElementById("ToteTable").children[0];
  if (ToteTable.children.length > 1) {
    for (i in ToteTable.children) {
      try {
        if (i != 0 && !isNaN(i)) {
          ToteRow = ToteTable.children[i];
          SelectBox = ToteRow.children[3].children[0];
          Status =
            SelectBox.options[SelectBox.selectedIndex].value.toUpperCase();
          Comments = ToteRow.children[4].firstElementChild.innerText;
          if (
            Status === "FULL" &&
            Comments.toUpperCase().indexOf("DAMAGED") == -1
          ) {
            Full++;
          } else {
            Empty++;
          }
        }
      } catch (Error) {}
    }
    document.getElementById("Full").innerText = "FULL = " + Full;
    document.getElementById("Empty").innerText = "EMPTY = " + Empty;
    if (Empty >= 10) {
      document.getElementById("Empty").classList.add("LowInv");
    } else if (Empty >= 5) {
      document.getElementById("Empty").classList.add("CheckInv");
      document.getElementById("Empty").classList.remove("LowInv");
    } else {
      document.getElementById("Empty").classList.remove("LowInv");
      document.getElementById("Empty").classList.remove("CheckInv");
    }
    document.getElementById("INV:0112003_2650_LB.MV").value = Full;
  }
}
/*=======================================================================
SEND/RECEIVE Tote TOTE FUNCTIONS
=======================================================================*/
function ToteSelected() {
  console.log("Tote Selected Script Started");
  const Table = this.parentElement.parentElement.parentElement.parentElement.id;
  if (Table == "ToteTable") {
    if (this.checked === true) {
      this.parentElement.parentElement.classList.add("Remove");
    } else {
      this.parentElement.parentElement.classList.remove("Remove");
    }
  } else if (Table == "ToteWithSupplierTable") {
    if (this.checked === true) {
      this.parentElement.parentElement.classList.add("Add");
    } else {
      this.parentElement.parentElement.classList.remove("Add");
    }
  }
}

function SendTotes() {
  console.log("Send Totes Script Started");
  let Item, Checkbox, Inactive, Element;
  const ToteInventory =
    document.getElementById("ToteTable").children[0].children;
  for (i in ToteInventory) {
    try {
      if (Item != "ToteHeader" && Item != undefined) {
        Checkbox = document.getElementById(Item + "_Inactive");
        if (Checkbox.checked === true) {
          Element = document.getElementById(Item);
          Inactive = { Inactive: true };
          UpdateListItem("Warehouse Inventory", Item, Inactive);
          Element.parentNode.removeChild(Element);
        }
      }
    } catch (Error) {}
    Item = ToteInventory[i].id;
  }
  GetToteData();
}

function RecieveTotes() {
  console.log("Receive Totes Script Started");
  let Item, Checkbox, Inactive, Element;
  const ToteInventory = document.getElementById("ToteWithSupplierTable")
    .children[0].children;
  for (i in ToteInventory) {
    try {
      if (Item != "ToteWithSupplierHeader" && Item != undefined) {
        Checkbox = document.getElementById(Item + "_Inactive");
        if (Checkbox.checked === true) {
          Element = document.getElementById(Item);
          Inactive = { Inactive: false };
          UpdateListItem("Warehouse Inventory", Item, Inactive);
          Element.parentNode.removeChild(Element);
        }
      }
    } catch (Error) {}
    Item = ToteInventory[i].id;
  }
  GetToteData();
}

/*=======================================================================
SEND DATA TO PI SERVER FUNCTIONS
=======================================================================*/
function GetInputData() {
  document.getElementById("Submit").disable = true;
  console.log("Collecting Data from Webpage");
  let Section,
    TableRow,
    ID,
    GMN,
    Tag,
    Units,
    LastSent,
    Data = {},
    DataToSend = {};
  let Sections = document.getElementsByTagName("section");
  for (i in Sections) {
    try {
      if (!isNaN(i)) {
        Section = Sections[i].id;
        if (Section != "Tote") {
          Data[Section] = Sections[i];
        }
      }
    } catch (Error) {}
  }
  for (Section in Data) {
    TableRow = Data[Section].querySelectorAll("tr");
    Data[Section] = {};
    for (i in TableRow) {
      try {
        if (!isNaN(i) && i != 0) {
          // EXCLUDE HEADER ROW & PROTOTYPE
          ID = TableRow[i].id;
          GMN = TableRow[i].children[0].innerText;
          Input = TableRow[i].getElementsByTagName("input");
          Input.disable = true;
          if (Input != undefined) {
            if (Input[0].value == "") {
              Units = Input[0].placeholder; // SEND PLACE HOLDER IF BLANK
            } else {
              Units = Input[0].value; // SEND VALUE IF NOT BLANK
            }
            Tag = Input[0].id;
            LastSent = Input[0].dataset.last_sent;
            DataToSend[ID] = {
              ID: ID,
              Section: Section,
              GMN: GMN,
              Tag: Tag,
              Units: Units,
              Time: GetDateTime(),
              LastSent: LastSent,
            };
          } else {
            delete Data[Section];
          }
        }
      } catch (Error) {}
    }
  }
  SendData(DataToSend);
}

function SendData(Data) {
  let Server = RESTRICTED,
    SPData = {},
    PIData = {},
    Value;
  for (i in Data) {
    try {
      if (Data[i].Tag.indexOf("INV") === 0) {
        PIData[i] = {
          ID: Data[i].ID,
          GMN: Data[i].GMN,
          Server: Server,
          Tag: Data[i].Tag,
          Value: Data[i].Units,
          Time: Data[i].Time,
        };
      }
      Value = document.getElementById(Data[i].Tag).value;
      if (Value != "" && Data[i].Tag.indexOf("INV") != 0) {
        SPData[i] = { Units: Data[i].Units, SentToPI: Data[i].Time };
      }
    } catch (Error) {}
  }
  console.log("Sending Data to PI: ", PIData);
  for (i in PIData) {
    try {
      SendtoPI(
        PIData[i].ID,
        PIData[i].Server,
        PIData[i].Tag,
        PIData[i].Value,
        PIData[i].Time,
        false
      );
    } catch (Error) {}
  }
  console.log("Sending Data to SharePoint");
  for (ID in SPData) {
    try {
      UpdateListItem("Warehouse Inventory", ID, SPData[ID]);
    } catch (Error) {}
  }
}

function GetDateTime() {
  let TimeUpdate,
    Options,
    CurrentDateTime,
    CurrentTime,
    LongDate,
    Time,
    Hours,
    TimeEntered,
    SendDateTime;
  clearInterval(TimeUpdate);
  CurrentDateTime = new Date(Date.now());
  // FORMAT DATE
  Options = { weekday: "long" };
  const Weekday = Intl.DateTimeFormat("en-US", Options).format(CurrentDateTime);
  Options = { month: "long", day: "numeric", year: "numeric" };
  LongDate = Intl.DateTimeFormat("en-US", Options).format(CurrentDateTime);
  // SET DATE ON INPUT FIELD
  DateEntered = document.getElementById("DateEntered");
  if (DateEntered.value === "") {
    try {
      DateEntered.valueAsDate = CurrentDateTime;
    } catch (Error) {}
  }
  // FORMAT TIME
  Hours = "0" + CurrentDateTime.getHours();
  Hours = Hours.slice(-2);
  Minutes = "0" + CurrentDateTime.getMinutes();
  Minutes = Minutes.slice(-2);
  CurrentTime = Hours + ":" + Minutes;
  // SET TIME ON INPUT FIELD
  TimeEntered = document.getElementById("TimeEntered");
  if (TimeEntered.value === "") {
    TimeEntered.value = CurrentTime;
  }
  // UPDATE TIME ON WEBPAGE
  TimeUpdate = setInterval(function () {
    if (IEBrowser()) {
      Hours = CurrentDateTime.getHours();
      Minutes = "0" + CurrentDateTime.getMinutes();
      Minutes = Minutes.slice(-2);
      Time = Hours + ":" + Minutes;
    } else {
      Options = { timeStyle: "short", hour12: true };
      Time = Intl.DateTimeFormat("en-US", Options).format(Date.now());
    }
    document.getElementById("Today").innerText =
      Weekday + " " + LongDate + " " + Time;
  }, 1000);
  // ADJUST TIME FOR FORM SUBMISSION TO WEBSERVICE
  TimeEntered = document.getElementById("TimeEntered").value;
  Hours = parseInt(TimeEntered.substring(0, 2));
  Hours = Hours + 4;
  TimeEntered = TimeEntered.replace(TimeEntered.substring(0, 2), Hours);

  SendDateTime = DateEntered.value + " " + TimeEntered;
  return SendDateTime.toString();
}

function SendtoPI(ID, Server, Tag, Value, Time, SendViaFetch) {
  if (SendViaFetch === undefined) {
    SendViaFetch = true;
  }
  const Specifications =
    "resizable=no, width=500, height=200, left=800, top=50";
  const sBaseUrl = "RESTRICTED";
  const sServerUrl = "?Server=" + Server;
  const sTagUrl = "&PITag=" + Tag;
  const sValueUrl = "&Value=" + Value;
  const sTimeURL = "&Time=" + Time;

  Url = sBaseUrl + sServerUrl + sTagUrl + sValueUrl + sTimeURL;
  if (SendViaFetch === true) {
    fetch(Url, { mode: "no-cors" })
      .then(function () {
        ShowDataSent(Tag);
      })
      .catch(function () {
        ShowDataFailed(Tag);
      });
  } else {
    try {
      let Name = ID + "-" + Tag;
      let PIServer = window.open(Url, Name, Specifications);
      let SPData = { Units: Value, SentToPI: Time };
      let interval = setInterval(function () {
        let PIServerState = PIServer.document.readyState;
        if (PIServer.document.readyState === "complete") {
          clearInterval(interval);
          ShowDataSent(Tag);
          UpdateListItem("Warehouse Inventory", ID, SPData);
          PIServer.close();
        }
      }, 100);
    } catch (Error) {
      ShowDataFailed(Tag);
    }
  }
  document.getElementById("Submit").disable = false;
}

function UpdateToteStatus() {
  let Status, ID, Data;
  Status = this.options[this.selectedIndex].value.toUpperCase();
  ID = parseInt(this.id);
  if (Status === "EMPTY") {
    Status = 0;
  } else {
    Status = 1;
  }
  Data = { Units: Status };
  UpdateListItem("Warehouse Inventory", ID, Data);
}

function ShowDataSent(Id) {
  let Input;
  Input = document.getElementById(Id);
  Input.parentElement.classList.add("Sent");
}

function ShowDataFailed(Id) {
  let Input;
  Input = document.getElementById(Id);
  Input.parentElement.classList.add("Failed");
}
/*=======================================================================
PRINT BLANK REPORT FUNCTIONS
=======================================================================*/
function SaveReport() {
  alert('Select the "Save as PDF" option on the Print Dialog Form.');
  window.print();
}

function PrintReport() {
  window.print();
}

function PrintBlankReport() {
  const Inputs = document.getElementsByTagName("input");
  for (i in Inputs) {
    try {
      if (!isNaN(i)) {
        // GET INPUT ELEMENTS ONLY
        Inputs[i].style.display = "none";
      }
    } catch (Error) {}
  }
  window.print();
  for (i in Inputs) {
    try {
      if (!isNaN(i)) {
        // GET INPUT ELEMENTS ONLY
        Inputs[i].style.display = "inline-block";
      }
    } catch (Error) {}
  }
}

function OpenDialog(Url, Title, Section) {
  if (Url.indexOf("?") === -1) {
    Url = Url + "?";
  }
  let options = {
    url: Url + "&Section=" + Section,
    title: Title,
    allowMaximize: false,
    showClose: true,
  };
  SP.SOD.execute(
    "sp.ui.dialog.js",
    "SP.UI.ModalDialog.showModalDialog",
    options
  );
  let IntervalDialog = setInterval(function () {
    // CHECKING THE PAGE FOR DIALOG BOX LOADED
    let Dialog = SP.UI.ModalDialog.get_childDialog();
    if (Dialog != null && Dialog.$g_0 != null) {
      clearInterval(IntervalDialog);
      const Form = Dialog.$g_0;
      // GET SAVE BUTTON (DEFAULT IS NEW FORM)
      let SaveButton = Form.getElementById(
        "ctl00_ctl30_g_747f96d6_1d8f_4677_8171_e4d21c8cbb88_ctl00_toolBarTbl_RightRptControls_ctl00_ctl00_diidIOSaveItem"
      );
      // CHECK IF THIS IS NEW FORM AND RE-ASSIGN SAVE BUTTON IF NOT
      if (SaveButton == null) {
        SaveButton = Form.getElementById(
          "ctl00_ctl30_g_f68a9c91_01d3_465b_a896_aaa560d4a59c_ctl00_toolBarTbl_RightRptControls_ctl00_ctl00_diidIOSaveItem"
        );
      }
      console.log("Save Button: ", SaveButton);
      SaveButton.addEventListener("click", PageRefresh);
    }
  }, 500);
}

function PageRefresh() {
  let Selected;
  console.clear();
  if (!IEBrowser()) {
    Selected = document.getElementById("Selected").innerText;
  } else {
    Selected = document.getElementsByClassName("Selected")[0].innerText;
  }
  if (Selected == "Tote Inventory") {
    setTimeout(GetToteData, 500);
  } else {
    setTimeout(GetSPData, 500);
  }
}

/*=======================================================================
PRINT BLANK REPORT FUNCTIONS
=======================================================================*/
function RunIEVersion() {
  const DateEntered = document.getElementById("DateEntered");
  const Options = document.getElementById("Options");
  const SaveButton = document.getElementById("Save");
  const ShowInventoryOption =
    document.getElementById("Options").firstElementChild;
  SaveButton.style.display = "none";
  ShowInventoryOption.style.display = "none";
  Options.style.justifyContent = "flex-end";
  DateEntered.type = "text";
  DateEntered.value =
    new Date().getMonth() +
    "/" +
    new Date().getDate() +
    "/" +
    new Date().getFullYear();
}
