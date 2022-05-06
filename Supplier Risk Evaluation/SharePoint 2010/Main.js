/*=======================================================================
UTILITY FUNCTIONS FOR MULTIPLE FORMS
=======================================================================*/
// CHECK IF USING IE
function IEBrowser() {
  const isChrome =
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  return !isChrome;
}

// SET VALUE FOR ANY INPUT TYPE
function SetValue(FieldInput, Value) {
  if (FieldInput.type == "text") {
    FieldInput.value = Value;
  }
  if (FieldInput.type == "checkbox") {
    if (Value == "") {
      Value = false;
    }
    FieldInput.checked = Value;
  }
  if (FieldInput.type == "select-one") {
    for (var i = 0; i < FieldInput.options.length; i++) {
      if (FieldInput.options[i].text == Value) {
        FieldInput.options[i].selected = true;
        return;
      }
    }
  }
}

// HIDE FIELD
function HideField(FieldName) {
  var FieldId = document.getElementById(FieldName);
  if (FieldId != null) {
    FieldId.parentElement.parentElement.style.display = "none";
  } else {
    console.log(FieldName + "NOT Found");
  }
}

// SHOW HIDDEN FIELD
function ShowField(FieldName) {
  var FieldId = document.getElementById(FieldName);
  if (FieldId != null) {
    FieldId.parentElement.parentElement.style.display = "table-row";
  }
}

// DISABLE FIELD INPUT
function Disable(FieldInput) {
  let PeopleLength, People;
  if (FieldInput.id != null) {
    PeopleLength = Number(FieldInput.id.lastIndexOf("ClientPeoplePicker")) + 18;
    if (PeopleLength === FieldInput.id.length) {
      document.getElementById(FieldInput.id + "_EditorInput").disabled = true;
      People = document.getElementById(FieldInput.id + "_HiddenInput").value;
      if (People == "") {
        FieldInput.style.display = "none";
      } else {
        FieldInput.style.display = "inline-block";
        FieldInput.style.border = "none";
        People = document.getElementById(FieldInput.id + "_ResolvedList");
        for (i = 0; i < People.children.length; i++) {
          People.children[i].children[1].style.textDecoration = "none";
          People.children[i].children[2].style.display = "none";
        }
      }
    } else if (
      FieldInput.id.lastIndexOf("DateTimeFieldDate") > 0 &&
      FieldInput.nodeName == "INPUT"
    ) {
      FieldInput.parentElement.nextSibling.style.display = "none";
      FieldInput.disabled = true;
    } else {
      FieldInput.disabled = true;
    }
  }
}

// RE-ENABLE FIELD INPUT
function Enable(FieldInput) {
  let PeopleLength, People;
  if (FieldInput.id != null) {
    PeopleLength = Number(FieldInput.id.lastIndexOf("ClientPeoplePicker")) + 18;
    if (PeopleLength === FieldInput.id.length) {
      document.getElementById(FieldInput.id + "_EditorInput").disabled = false;
      FieldInput.style.display = "inline-block";
      FieldInput.style.border = "1px solid #ababab";
      People = document.getElementById(FieldInput.id + "_ResolvedList");
      for (i = 0; i < People.children.length; i++) {
        People.children[0].children[1].style.textDecoration = "underline";
        People.children[0].children[2].style.display = "inline-block";
      }
    } else if (
      FieldInput.id.lastIndexOf("DateTimeFieldDate") > 0 &&
      FieldInput.nodeName == "INPUT"
    ) {
      FieldInput.parentElement.nextSibling.style.display = "table-cell";
      FieldInput.disabled = false;
    } else {
      FieldInput.disabled = false;
    }
  }
}

// CHECK REQUIRED FIELD
function RequiredField(FieldInput) {
  let Input, Text, Person;
  if (FieldInput.id.lastIndexOf("ClientPeoplePicker") > 0) {
    Input = FieldInput.children[0];
    Text = Input.value.slice(1, Input.value.length - 1);
    if (Text != "") {
      Person = JSON.parse(Text);
      if (Person.IsResolved === true) {
        FieldInput.style.background = "none";
        return true;
      } else {
        FieldInput.style.background = "rgba(217,26,58,0.3)";
        return false;
      }
    } else {
      FieldInput.style.background = "rgba(217,26,58,0.3)";
      return false;
    }
  } else if (FieldInput.value == "") {
    FieldInput.style.background = "rgba(217,26,58,0.3)";
    return false;
  } else {
    FieldInput.style.background = "none";
    return true;
  }
}

// FORCE FIELD TO BE UPPERCASE
function ForceUppercase(FieldInput) {
  FieldInput.value = FieldInput.value.toUpperCase();
}

// HIDE ENTIRE FORM (USED FOR VIEW SETTING)
function ClearForm(Form) {
  let i, PeopleText, Row, FieldName;
  for (i in Form) {
    if (Form[i] != Form.SaveButton && Form[i] != Form.FormType) {
      // HIDE DATES
      if (Form[i].id.lastIndexOf("DateTimeFieldDate") > 0) {
        Row =
          Form[i].parentElement.parentElement.parentElement.parentElement
            .parentElement.parentElement.parentElement;
      } else {
        // EXCLUDE INITIAL HELP TEXTS FROM HIDE FUNCTION
        PeopleText =
          Number(Form[i].id.lastIndexOf("ClientPeoplePicker_InitialHelpText")) +
          34;
        if (PeopleText != Form[i].id.length) {
          Row = Form[i].parentElement.parentElement.parentElement;
        }
      }
      FieldName = Row.children[0].children[0].id;
      HideField(FieldName);
    }
  }
  console.log("Form Cleared");
}

// REMOVE ITEMS FROM FORM OBJECT (NEW OBJECT = REVISEDFORM)
function ReviseForm(Form, ExcludeFields) {
  let RevisedForm = Form;
  for (i = 0; i < ExcludeFields.length; i++) {
    Exclude = ExcludeFields[i];
    if (RevisedForm.Exclude != undefined) {
      delete RevisedForm[Exclude];
    }
  }
  return RevisedForm;
}

// ADD BORDER TO FORM ROW
function AddBorder(FieldName, BorderType, BorderStyle) {
  var FieldTR = document.getElementById(FieldName).parentElement.parentElement;
  BorderType = BorderType.toUpperCase();
  for (i = 0; i < FieldTR.children.length; i++) {
    if (BorderType == "TOP") {
      FieldTR.children[i].style.borderTop = BorderStyle;
    }
    if (BorderType == "BOTTOM") {
      FieldTR.children[i].style.borderBottom = BorderStyle;
    }
  }
}

// INSERT ROW ABOVE A FIELD (FOR TITLES)
function InsertRow(FieldName, TextRow1, StyleRow1, TextRow2, StyleRow2) {
  var ID1;
  if (TextRow1 != "") {
    ID1 = TextRow1.replace(/\s/g, "");
  } else {
    ID1 = "DynamicTitle";
  }
  var FieldId = document.getElementById(FieldName);
  FieldId.parentElement.parentElement.insertAdjacentHTML(
    "beforeBegin",
    "<tr id=" +
      ID1 +
      "Row><td id=" +
      ID1 +
      " class=ms-formlabel style='" +
      StyleRow1 +
      "'>" +
      TextRow1 +
      "</td><td style='" +
      StyleRow2 +
      "'>" +
      TextRow2 +
      "</td></tr>"
  );
}

// REMOVE ADDED DYNMAIC ELEMENT
function RemoveElement(RowId) {
  if (document.getElementById(RowId) != null) {
    document
      .getElementById(RowId)
      .parentElement.removeChild(document.getElementById(RowId));
    console.log(RowId + "Element Removed");
  }
}

// INSERT INPUT BESIDE ANOTHER INPUT FIELD
function InsertBeside(InsertBeside, Text, InputToCopy) {
  let IdText, Copy;
  if (InputToCopy != "") {
    const FieldName =
      InputToCopy.parentElement.parentElement.parentElement.children[0]
        .children[0].id;
    const CopyName = FieldName + "Copy";
    // HIDE ROW
    InputToCopy.parentElement.parentElement.parentElement.style.display =
      "none";
    // CREATE AND STYLE COPIED INPUT
    Copy = InputToCopy.cloneNode(true);
    Copy.id = CopyName;
    Copy.style.display = "inline";
    Copy.style.marginLeft = "0.5rem";
    Copy.className = InputToCopy.className;
    // ADD COPIED INPUT BESIDE FIELD INPUT
    InsertBeside.insertAdjacentHTML(
      "afterend",
      "<h3 id=" +
        FieldName +
        'Text class="ms-h3 ms-standardheader" style="display:inline; margin-left:0.5rem">' +
        Text +
        "</h3>"
    );
    document
      .getElementById(FieldName + "Text")
      .insertAdjacentHTML("afterend", Copy.outerHTML);
    // COPY VALUE FROM NEW ELEMENT AND SET THE HIDDEN ELEMENT
    document.getElementById(CopyName).addEventListener("change", function () {
      CopyValue(InputToCopy);
    });
  } else {
    IdText = Text.replace(/\s+/g, "");
    InsertBeside.insertAdjacentHTML(
      "afterend",
      "<h3 id=" +
        IdText +
        'Text class="ms-h3 ms-standardheader" style="display:inline; margin-left:0.5rem">' +
        Text +
        "</h3>"
    );
  }
}

// MAKE FIELD READ ONLY
function ReadONLY(FieldName) {
  var FieldId =
    document.getElementById(FieldName).parentElement.parentElement.children[1]
      .children[0].children[0];
  FieldId.readOnly = true;
  FieldId.style.border = "none";
  FieldId.unselectable = "on";
  FieldId.style.userSelect = "none";
  FieldId.contentEditable = false;
  FieldId.disabled = true;
}

// REVERSE READ ONLY STATUS
function ModifyField(FieldName) {
  var FieldId =
    document.getElementById(FieldName).parentElement.parentElement.children[1]
      .children[0].children[0];
  FieldId.readOnly = false;
  FieldId.style.border = "1px solid #ababab";
}

// PRINT FORM
function PrintForm(Form) {
  PrintArea = window.open();
  PrintArea.document.write(Form);
  PrintArea.print();
  PrintArea.close();
}

/*=======================================================================
GET AND RETURN CURRENT USER INFORMATION 
=======================================================================*/
// SET FIELD TO CURRENT USER
var currentUser, cx;
function SetCurrentUser(Field, ExcludeMIS) {
  let SetField = true;
  ExecuteOrDelayUntilScriptLoaded(GetCurrentUser, "sp.js");
  ExecuteOrDelayUntilScriptLoaded(function () {
    console.log("Client People Picker JS Loaded");
    setTimeout(function () {
      if (InMISGroup(currentUser) && ExcludeMIS === true) {
        SetField = false;
      }
      if (SetField === true) {
        SPClientPeoplePicker.PickerObjectFromSubElement(Field).AddUserKeys(
          currentUser.get_title()
        );
      }
    }, 500);
  }, "clientpeoplepicker.js");
}

function GetCurrentUser() {
  try {
    cx = new SP.ClientContext.get_current();
    currentUser = cx.get_web().get_currentUser();
    cx.load(currentUser);
    cx.executeQueryAsync(
      Function.createDelegate(this, this.GetUserSucceeded),
      Function.createDelegate(this, this.GetUserFailed)
    );
  } catch (error) {
    console.log("Get Current User Unsucessful");
  }
}

function GetUserSucceeded() {
  console.log("Get Current User Successful");
}

function GetUserFailed(sender, args) {
  alert(
    "Error: " + args.get_message() + "\nStackTrace: " + args.get_stackTrace()
  );
}

function GetPeopleFinder(Field) {
  const PeopleFinder = ExecuteOrDelayUntilScriptLoaded(function () {
    const PeopleFinder = setTimeout(function () {
      const PeopleFinder =
        SPClientPeoplePicker.PickerObjectFromSubElement(Field);
      console.log("PeopleFinder:", PeopleFinder);
      return PeopleFinder;
    }, 500);
    return PeopleFinder;
  }, "clientpeoplepicker.js");
  return PeopleFinder;
}

/*=======================================================================
GET AND RETURN SHAREPOINT LIST ITEM DATA
=======================================================================*/
//GET LIST ITEM
var Item,
  ItemsFound,
  ItemsQueried = {};
function FindListItem(ListName, QueryFilter, Return, OrderBy) {
  /*  
  ListName = Name of the List you want to get values from
  QueryFilter = JS Object of Filters you want to place on the List
    Field Type Information go to following URL: https://joshmccarty.com/a-caml-query-quick-reference/
    Filter Type Information:
      Neq: Not Equals To
      Eq: Equals
      Geq: Greater Than or Equal To
      Leq: Less Than or Equal To
      Gt: Greater Than
      Lt: Less Than
    NOTE: Field Names MUST match Internal Field Names
    Example: {Field: {
      Type:Field Type, 
      Value: Filter Value, 
      FilterType: Type}}
  Return = Array of Field Names you want returned from the Query
    Example: [Field1, Field2]
  OrderBy = JS Object of Order Sequence
    Example: {Order: {
      Column: Internal Column Name
      Ascending: (True/False)
    }}
  */
  ExecuteOrDelayUntilScriptLoaded(function () {
    if (cx === undefined) {
      cx = new SP.ClientContext.get_current();
    }
    const List = cx.get_web().get_lists().getByTitle(ListName);
    const camlQuery = new SP.CamlQuery();
    const FilterArray = Object.keys(QueryFilter);
    let Filter = "",
      Order = "<OrderBy>";

    for (i in QueryFilter) {
      if (QueryFilter[i].FilterType === undefined) {
        QueryFilter[i].FilterType = "Contains";
      }
      if (i != FilterArray[FilterArray.length - 1]) {
        Filter += "<And>";
      }
      Filter +=
        "<" +
        QueryFilter[i].FilterType +
        "><FieldRef Name='" +
        i +
        "'/><Value Type='" +
        QueryFilter[i].Type +
        "'>" +
        QueryFilter[i].Value +
        "</Value></" +
        QueryFilter[i].FilterType +
        ">";
    }
    for (i in QueryFilter) {
      if (i != FilterArray[FilterArray.length - 2] && i != FilterArray[0]) {
        Filter += "</And>";
      }
      if (FilterArray.length > 2 && i == FilterArray[FilterArray.length]) {
        Filter += "</And>";
      }
    }
    for (i in OrderBy) {
      if (OrderBy[i].Ascending == true) {
        OrderBy[i].Ascending = "True";
      } else {
        OrderBy[i].Ascending = "False";
      }
      Order +=
        '<FieldRef Name="' +
        OrderBy[i].Column +
        '" Ascending="' +
        OrderBy[i].Ascending +
        '"/>';
    }
    Order += "</OrderBy>";
    const Query =
      "<View><Query><Where>" + Filter + "</Where>" + Order + "</Query></View>";
    camlQuery.set_viewXml(Query);
    this.Item = List.getItems(camlQuery);
    cx.load(Item, "Include(Id," + Return.toString() + ")");
    cx.executeQueryAsync(
      Function.createDelegate(this, function () {
        this.QuerySuccess(ListName, Return, Query);
      }),
      Function.createDelegate(this, this.QueryFailed)
    );
  }, "sp.js");
}

function QuerySuccess(List, Return, Query) {
  let ID;
  ItemsFound = {};
  const listItemEnumerator = Item.getEnumerator();
  while (listItemEnumerator.moveNext()) {
    let ListItem = listItemEnumerator.get_current();
    ID = List + "_" + ListItem.get_id();
    ItemsFound[ID] = {};
    ItemsQueried[ID] = {};
    for (i = 0; i < Return.length; i++) {
      WriteItemInfo(listItemEnumerator, ItemsFound[ID], Return[i]);
      WriteItemInfo(listItemEnumerator, ItemsQueried[ID], Return[i]);
    }
    try {
      WriteToTable(ItemsFound[ID]);
    } catch (error) {}
  }
  if (Object.keys(ItemsFound).length > 0) {
    console.log("Query: ", Query);
    console.log("Items Found:", Object.keys(ItemsFound).length);
    console.log("All Items Queried:", Object.keys(ItemsQueried).length);
  } else {
    console.log("No Items Matching: ", Query);
  }
}

function WriteItemInfo(Enumerator, Item, Property) {
  ListItem = Enumerator.get_current();
  Item[Property] = ListItem.get_item(Property);
  return Item;
}

function QueryFailed(sender, args) {
  alert("Request failed. " + args.get_message() + "\n" + args.get_stackTrace());
}

/*=======================================================================
AUTOCOMPLETE FUNCTIONS FOR TEXT ENTRY FIELDS
=======================================================================*/
var ReturnID;
function AddAutoComplete(Input, LookUp) {
  /* 
  Input = Input Element that you want to create Autocomplete function to.
  LookUp = Array of the possible Values to select from. (Found using Javascript FindListItems)
  */
  const FieldName =
    Input.parentElement.parentElement.parentElement.children[0].children[0].id;
  let Focus;
  Input.autocomplete = "off";
  Input.parentElement.style.position = "relative";
  Input.parentElement.style.display = "inline-block";
  Input.addEventListener("input", function (e) {
    let AutoCompleteList,
      i,
      val = this.value;
    Input.autocomplete = "off";
    closeAllLists();
    if (!val) {
      return false;
    }
    Focus = -1;
    AutoCompleteList = document.createElement("DIV");
    AutoCompleteList.setAttribute("id", FieldName + "AutoComplete");
    AutoCompleteList.setAttribute("class", "AutoCompleteList");
    this.parentNode.appendChild(AutoCompleteList);
    for (i = 0; i < LookUp.length; i++) {
      let Id = i;
      if (AutoCompleteList.children.length <= 20) {
        if (LookUp[i].indexOf(val) >= 0) {
          AddAutoCompleteDIV(FieldName, LookUp, Input, Id);
        }
      }
    }
  });
  Input.addEventListener("keydown", function (e) {
    const FieldName =
      this.parentElement.parentElement.parentElement.children[0].children[0].id;
    let x = document.getElementById(FieldName + "AutoComplete");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      // DOWN ARROW
      Focus++;
      AddActive(x, Focus);
    } else if (e.keyCode == 38) {
      // UP ARROW
      Focus--;
      AddActive(x, Focus);
    } else if (e.keyCode == 13 || e.keyCode == 9) {
      // ENTER BUTTON & TAB BUTTON
      if (e.keyCode == 13) {
        // ENTER BUTTON PRESSED
        e.preventDefault();
      }
      if (Focus > -1) {
        if (x) x[Focus].click(); // SELECT FOCUSED ITEM
        try {
          Input.change(); // TRIGGER CHANGE EVENT ON TAB OFF INPUT
        } catch (Error) {
          console.log(Error.message);
        }
      } else {
        closeAllLists();
      }
    }
  });
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function closeAllLists() {
  let LookUp = document.getElementsByClassName("AutoCompleteList");
  for (i = 0; i < LookUp.length; i++) {
    if (LookUp[i] != undefined) {
      LookUp[i].parentNode.removeChild(LookUp[i]);
    }
  }
}

function AddAutoCompleteDIV(FieldName, LookUp, Input, Id) {
  let Item;
  let Value = Input.value;
  let ReturnValue = LookUp[Id].substr(0, LookUp[Id].indexOf(" - "));
  Item = document.createElement("DIV");
  Item.innerHTML = LookUp[Id].substr(0, LookUp[Id].indexOf(Value));
  Item.innerHTML +=
    "<strong>" +
    LookUp[Id].substr(LookUp[Id].indexOf(Value), Value.length) +
    "</strong>";
  Item.innerHTML += LookUp[Id].substr(LookUp[Id].indexOf(Value) + Value.length);
  Item.innerHTML += '<input type="hidden" value="' + LookUp[Id] + '">';
  Item.addEventListener("click", function () {
    Input.value = ReturnValue;
    closeAllLists();
  });
  document.getElementById(FieldName + "AutoComplete").appendChild(Item);
}

function AddActive(x, Focus) {
  if (!x) return false;
  RemoveActive(x);
  if (Focus >= x.length) Focus = 0;
  if (Focus < 0) Focus = x.length - 1;
  x[Focus].classList.add("AutoComplete-Active");
  x[Focus].scrollIntoView(false);
}

function RemoveActive(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("AutoComplete-Active");
  }
}

function GMNAutoComplete(GMN, Filter) {
  ForceUppercase(GMN);
  let GMNFilter = { Inactive: { Type: "Text", Value: "A" } };
  const Return = [
    "Title",
    "Material_x0020_Description",
    "Plants",
    "Family_x0020_GMN",
    "PM",
  ];
  const Delay = 4000;
  if (Filter != undefined) {
    GMNFilter = Filter;
  }
  let GMNsList = [];
  GMN.value = GMN.value.toUpperCase();
  try {
    if (Object.keys(ItemsQueried).length <= 100) {
      // QUERY GMNS LIST IF NOT ALREADY QUERIED
      ExecuteOrDelayUntilScriptLoaded(function () {
        cx = new SP.ClientContext("/sites/MIS");
        FindListItem("GMNs", GMNFilter, Return);
        setTimeout(function () {
          for (i in ItemsQueried) {
            if (i.indexOf("GMNs") >= 0) {
              // ONLY LOOK-UP GMN DATA
              GMNsList +=
                ItemsQueried[i].Title +
                " - " +
                ItemsQueried[i].Material_x0020_Description;
            }
          }
          console.log("GMNsList: ", GMNsList);
        }, Delay);
      }, "sp.js");
    }
  } catch (error) {
    console.log("Error Occurred: ", error.message);
  }
  // CREATE INTELISENSE DROP-DOWN
  console.log("GMNs Queried: ", ItemsQueried);
  if (GMNsList.length === 0) return; // END FUNCTION IF GMN LIST NOT POPULATED
  if (!IEBrowser()) {
    AddAutoComplete(GMN, GMNsList);
  } else if (GMN.value.length >= 6 || isNaN(GMN.value[2])) {
    AddAutoComplete(GMN, GMNsList);
    console.log("AddAutoComplete Inserted (IE ONLY)");
  }
  GMN.placeholder = "Enter GMN or Description";
}

var GMNInfo;
function GetGMNInfo(GMN, ID) {
  try {
    ExecuteOrDelayUntilScriptLoaded(function () {
      let Description,
        Plants = [],
        FGMN,
        PM,
        QueryResults = [];
      for (i in ItemsQueried) {
        if (i.indexOf("GMNs") >= 0 && GMN.value != "") {
          // ONLY LOOK-UP GMN DATA
          if (GMN.value.length == 8 && ItemsQueried[i].Title == GMN.value) {
            ID = i;
          } else if (
            ItemsQueried[i].Material_x0020_Description.indexOf(GMN.value) >=
              0 ||
            ItemsQueried[i].Title.indexOf(GMN.value) >= 0
          ) {
            QueryResults[i] = ItemsQueried[i].Title; // APPEDND MATCH TO QUERY RESULTS OBJECT
            ID = Object.keys(QueryResults)[0]; // USE THE FIRST VALUE IN THE RESULTS OBJECT
            GMN.value = ItemsQueried[ID].Title;
          }
        }
      }
      if (GMN.value != "") {
        Description = ItemsQueried[ID].Material_x0020_Description;
        for (p in ItemsQueried[ID].Plants) {
          Plants.push(ItemsQueried[ID].Plants[p].$66_1);
        }
        FGMN = ItemsQueried[ID].Family_x0020_GMN;
        PM = ItemsQueried[ID].PM;
        if (!IEBrowser()) {
          closeAllLists();
        }
      } else {
        Description = "";
        Plants = "";
        FGMN = "";
        PM = "";
      }
      GMNInfo = {
        GMN: ID,
        Description: Description,
        Plants: Plants,
        FGMN: FGMN,
        PM: PM,
      };
      return GMNInfo;
    }, "sp.js");
  } catch (error) {
    console.log(error.message);
  }
}

/*=======================================================================
SHAREPOINT UPDATE DOCUMENT FUNCTIONS
=======================================================================*/
function UpdateListItem(ListName, ItemId, Data) {
  cx = new SP.ClientContext();
  let List = cx.get_web().get_lists().getByTitle(ListName);
  console.log("Item to Update:", ItemId);
  this.ListItem = List.getItemById(ItemId);
  for (Column in Data) {
    ListItem.set_item(Column, Data[Column]);
  }
  ListItem.update();
  cx.executeQueryAsync(
    Function.createDelegate(this, function () {
      this.onUpdateSucceeded(Data);
    }),
    Function.createDelegate(this, this.onUpdateFailed)
  );
}

function onUpdateSucceeded(Data) {
  console.log("Data Updated: ", Data);
}

function onUpdateFailed(sender, args) {
  console.log(
    "Update Request Failed. " +
      args.get_message() +
      "\n" +
      args.get_stackTrace()
  );
}

/*=======================================================================
SHAREPOINT DELETE DOCUMENT FUNCTIONS
=======================================================================*/
function DeleteDocument(NameInput, Library) {
  let Delete,
    Title = NameInput.value + NameInput.nextSibling.innerText;
  cx = new SP.ClientContext();
  let Site = cx.get_web();
  let URL =
    _spPageContextInfo.webServerRelativeUrl + "/" + Library + "/" + Title;
  fileToDelete = Site.getFileByServerRelativeUrl(URL);
  Delete = confirm("Are you sure you want to Delete " + NameInput.value + "?");
  if (Delete) {
    fileToDelete.deleteObject();
    cx.executeQueryAsync(
      Function.createDelegate(this, this.onDeleteSucceeded),
      Function.createDelegate(this, this.onDeleteFailed)
    );
  }
}

function onDeleteSucceeded() {
  window.frameElement.cancelPopUp();
}

function onDeleteFailed(sender, args) {
  alert(
    "Delete Request Failed. " +
      args.get_message() +
      "\n" +
      args.get_stackTrace()
  );
}
