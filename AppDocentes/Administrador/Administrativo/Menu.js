$(document).ready(function () {
    Sesion();    

    function IdentificarMenu() {
        var url = window.location.pathname;
        url = url.split("/");
        url = url[url.length - 1];

        var Menu = $('#Menu nav div ul');
        Menu = Menu[0];

        var com = Menu.childNodes;
        var ActiLi = null;
        $(com).each(function (k, l) {
            var nex = l.nextSibling;
            if (nex != null) {
                if (l.nextSibling.nodeName === "LI") {
                    $(l.nextSibling).removeClass("Active2");
                    var elem = l.nextSibling.childNodes;
                    if (elem.length > 3) {
                        $(elem).each(function () {
                            var ele2 = this.localName;
                            if (ele2 === 'ul') {
                                ele2 = this.childNodes;;
                                $(ele2).each(function () {
                                    if (this.nodeName == "LI") {
                                        $(this.childNodes).each(function () {
                                            if (this.nodeName === "A") {
                                                ele2 = this.getAttribute("href");
                                                if (ele2.includes(url)) {
                                                    ActiLi = l.nextSibling;
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        $(elem).each(function () {
                            var ele2 = this.localName;
                            if (ele2 === 'a') {
                                ele2 = this.getAttribute("href");
                                if (ele2 !== null) {
                                    if (ele2.includes(url)) {
                                        ActiLi = l.nextSibling;
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });

        $(ActiLi).addClass('Active2');

    }
    //$('#Load').modal('show');
    
    function Sesion() {
        var UserName = sessionStorage.getItem("UserName");
        var Nombre = sessionStorage.getItem("Nombre");
        if (UserName == null) {
            window.open("../Index.html", "_parent");
        } else {
            $('#lblNombre').text(Nombre);
            
            $('#Menu').load('../Administrativo/MDinamic.html', function () {
                IdentificarMenu();
            });
            
            //BuscarMenu();
        }
    }   
});