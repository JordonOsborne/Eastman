  /*=======================================================================
  OTHER NEW DIALOGS
  =======================================================================*/
  // NEW PROBLEM LOG
  function NewProblem(pageUrl) {
    var options = {
      url: pageUrl,
      title: 'Add Problem Log',
      allowMaximize: false,
      showClose: true,
      width: 600,
      height: 700
    };
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
  }

  // NEW MIS PROJECT
  function NewProject(pageUrl) {
    var options = {
    url: pageUrl,
    title: 'New MIS Project',
    allowMaximize: false,
    showClose: true,
    width: 750,
    height: 750
    };
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
  }

  // NEW DISTRIBUTION LIST CONTACT
  function NewDListContact(pageUrl) {
    var options = {
      url: pageUrl,
      title: 'New Distribution List Contact',
      allowMaximize: false,
      showClose: true,
      width: 650,
      height: 400
    };
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
  }

  // NEW GMN REQUEST
  function NewGMN(pageUrl) {
    var options = {
      url: pageUrl,
      title: 'New GMN Request',
      allowMaximize: false,
      showClose: true,
      width: 650,
      height: 825
    };
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
  } 
  
  // NEW WAREHOUSE ORDER
  function NewWHOrder(pageUrl) {
    var options = {
      url: pageUrl,
      title: 'New Warehouse Order',
      allowMaximize: false,
      showClose: true,
      width: 750,
      height: 550
    };
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
  }
  // NEW COMPARTMENT RAIL CAR
  function CompartmentCarCalculator(pageUrl) {
    var options = {
    url: pageUrl,
    title: 'Multi-Compartment Rail Car Calculator',
    allowMaximize: false,
    showClose: true,
    width: 600,
    height: 400
    };
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
    } 