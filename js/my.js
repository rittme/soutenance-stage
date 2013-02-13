var tags = ["Comptabilité", "Droit", "Gestion", "Ressources Humaines", "Paie", "Aide Comptable", 
            "Droit Social", "Fiscalité", "Management", "Entreprise", "Création d'entreprise",
            "Droit des sociétés", "Normes", "Impôts", "TVA", "Stratégie", 
            "Sécurité Sociale", "Licenciement", "Formation", "Congé"];
         

$(function () {
    "use strict";
    $('#expr').click(function (e) {
        $('#modal').modal();
    });
    
    //Lors d'un click sur le bouton d'ajout de tag, on la crée
    $('#tag-btn').click(function (e) {
        e.preventDefault();
        //S'il n'est pas actif, on fait rien
        if($(this).hasClass('disabled')) {
            return false;
        }
        //Sinon on appele la fonction creerTag()
        creerTag();
    });
    
    /* Bouton pour afficher toutes les tags */
	$("#tag-toutes").click(function (e) {
		$("#tag-recherche").val("");
        tag_btn_disable();
		e.preventDefault();
		liste_ajax_tags('*');
	});
    
    /* Recherche de tags */
	$("#tag-recherche").keyup(function () {
        if ($(this).val().length > 0) {
            liste_ajax_tags($(this).val(), activerAjoutTag);
        } else {
            tag_btn_disable();
            $("#tag-list").html("");
        }
	});
    
    /* Ecouteur des cliques sur les tags, pour les supprimer de la bdd */
    $("#tag-list").on("click", "a", function (e){
        //Récupère la tag
        var tag = $(this).text().trim();

        //Enleve la tag selectionnée de l'array
        tags.splice(tags.indexOf(tag), 1);

        //Enleve la tag de la liste (visuelle)
        $(this).parent().remove();
    });
});

/* Gestion de l'activation/desactivation du bouton de ajout de la tag dans "tag-recherche" (liste d'articles) */
function activerAjoutTag(results) {
    "use strict";
    //Si la liste de tags retourné est vide, on active le bouton
	if (results.length < 1) {
        tag_btn_enable();
	} else {
        //Sinon, on vérifie s'il n'existe pas une tag de même nom déjà créé
        var lower_tags = [];
        $.each(tags, function (k, v){
            lower_tags.push(v.toLowerCase());
        });
        // S'il n'existe pas, on active le bouton
        if($.inArray($("#tag-recherche").val().toLowerCase(), lower_tags) != -1 ) {
            tag_btn_disable();
        } else {
            tag_btn_enable();
        }
	}
}

/* créer tag */
function creerTag() {
    "use strict";
    console.log('click');
    var item = $('#tag-recherche').val();
    tags.push(item);
    $( document.createElement('li')).html('<a>' + item + ' <i class="icon-trash icon-white"></i> </a>').appendTo('#tag-list');

    //Desactive le bouton d'ajout
    tag_btn_disable();
}

//Desactivation du bouton
function tag_btn_disable(){
    $("#tag-btn").addClass("disabled");
};

//Activation du bouton
function tag_btn_enable(){
    $("#tag-btn").removeClass("disabled");
};

/* Recherche les tags et les ajoute a l'UL #tag-list - Asynchrone */
function liste_ajax_tags(query, callback) {
    "use strict";
    
    $("#tag-list").html('<div class="loader-s"></div>');

    // Array des items de la liste
    var items = [];

    // Fonction de récupération des tags
    recup_tags(query, function (data){

        // Pour chaque résultat obtenu, on ajoute à l'array d'items
        $.each(data, function (key, val) {
            items.push('<li id="' + val + '"><a>' + val + ' <i class="icon-trash icon-white"></i> </a></li>');
        });

        //On ajoute les valeurs a la liste UL, après la vider
        $("#tag-list").html(items.join('\n'));

        //On execute le callback
        callback(data);
    });
}

var recherche = "";

function recup_tags(query, callback){
    
    var arr;
    if(query == '*'){
        arr = tags;
    } else {
        recherche = query;
        arr = jQuery.map(tags, function (value) {
           var search = new RegExp(recherche, "gi");
           if(value.match(search)) {
               return value;
          }
          return null;
        });
    }
    callback(arr);
}