var tagAnalyticsCNIL = {}


//Pour ajouter du code google Analytics, le faire vers la ligne 200 dans la fonction callGoogleAnalytics.


tagAnalyticsCNIL.CookieConsent = function() {
	
	// Personnaliser le popup
	var gaProperty = 'UA-98472894-1' //code Google Analytics
	var text_message = 'En poursuivant votre navigation, vous acceptez le dépôt de cookies tiers destinés à vous proposer la meilleure expérience sur notre site.'
	var lien_message = 'mentions-legales.php'
	var couleur_btn = '#c20b2a'
	var valider_au_clic = false //passer à true pour autoriser les cookies des que l'utilisateur clique quelque part sur la page -> pas conseillé car : non conforme lois 2018 et mauvaise exp utilisateur 
	
	// Désactive le tracking si le cookie d’Opt-out existe déjà.
	var disableStr = 'ga-disable-' + gaProperty;
	var firstCall = false;
	var domaineName = '';

	//Cette fonction retourne la date d’expiration du cookie de consentement 

	function getCookieExpireDate() { 
	 var cookieTimeout = 33696000000;// Le nombre de millisecondes que font 13 mois 
	 var date = new Date();
	 date.setTime(date.getTime()+cookieTimeout);
	 var expires = "; expires="+date.toGMTString();
	 return expires;
	}
	
	function getDomainName() {
		if (domaineName != '') {
			return domaineName;
		} else {
			var hostname = document.location.hostname;
			if (hostname.indexOf("www.") === 0)
				hostname = hostname.substring(4);
			return hostname;
		}
	}
	
	//Cette fonction définie le périmétre du consentement ou de l'opposition  (en fonction du domaine)
    //Par défaut nous considérons que le domaine est tout ce qu'il y'a aprés  "www"	
	function getCookieDomainName() {
		var hostname = getDomainName();
		var domain = "domain=" + "."+hostname;
		return domain;
	}


	//Cette fonction vérifie si on  a déjà obtenu le consentement de la personne qui visite le site
	function checkFirstVisit() {
	   var consentCookie =  getCookie('hasConsent'); 
	   if ( !consentCookie ) return true;
	}
		  
		  
	// Fonction utile pour récupérer un cookie a partir de son nom
	function getCookie(NameOfCookie)  {
		if (document.cookie.length > 0) {        
			begin = document.cookie.indexOf(NameOfCookie+"=");
			if (begin != -1)  {
				begin += NameOfCookie.length+1;
				end = document.cookie.indexOf(";", begin);
				if (end == -1) end = document.cookie.length;
				return unescape(document.cookie.substring(begin, end)); 
			}
		 }
		return null;
	}

	//Récupère la version d'Internet Explorer, si c'est un autre navigateur la fonction renvoie -1
	function getInternetExplorerVersion() {
	  var rv = -1;
	  if (navigator.appName == 'Microsoft Internet Explorer')  {
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
		  rv = parseFloat( RegExp.$1 );
	  }  else if (navigator.appName == 'Netscape')  {
		var ua = navigator.userAgent;
		var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
		  rv = parseFloat( RegExp.$1 );
	  }
	  return rv;
	}

	//Effectue une demande de confirmation de DNT pour les utilisateurs d'IE
	function askDNTConfirmation() {
		var r = confirm("La signal DoNotTrack de votre navigateur est activé, confirmez vous activer la fonction DoNotTrack?")
		return r;
	}

	//Vérifie la valeur de navigator.DoNotTrack pour savoir si le signal est activé et est à 1
	function notToTrack() {
		if ( (navigator.doNotTrack && (navigator.doNotTrack=='yes' || navigator.doNotTrack=='1')) || ( navigator.msDoNotTrack && navigator.msDoNotTrack == '1') ) {
			var isIE = (getInternetExplorerVersion()!=-1)
			if (!isIE){	
				 return true;
			}else {
				return askDNTConfirmation();
			}
			return false;
		}
	}

	//Si le signal est à 0 on considére que le consentement a déjà été obtenu
	function isToTrack() {
		if ( navigator.doNotTrack && (navigator.doNotTrack=='no' || navigator.doNotTrack==0 )) {
			return true;
		}
	}
	   
	// Fonction d'effacement des cookies   
	function delCookie(name )   {
		var path = ";path=" + "/";
		var expiration = "Thu, 01-Jan-1970 00:00:01 GMT";       
		document.cookie = name + "=" + path +" ; "+ getCookieDomainName() + ";expires=" + expiration;
	}
	  
	// Efface tous les types de cookies utilisés par Google Analytics    
	function deleteAnalyticsCookies() {
		var cookieNames = ["__utma","__utmb","__utmc","__utmz","_ga","_gat"]
		for (var i=0; i<cookieNames.length; i++)
			delCookie(cookieNames[i])
	}

	//La fonction qui informe et demande le consentement. Il s'agit d'un div qui apparait au centre de la page
	function createInformAndAskDiv() {
		var bodytag = document.getElementsByTagName('body')[0];
		var div = document.createElement('div');
		div.setAttribute('id','inform-and-ask');
		var margeinfobox ="";
		if(valider_au_clic == true){
			div.style.width= window.innerWidth+"px" ;
			div.style.height= window.innerHeight+"px";
			margeinfobox = "position: fixed;bottom: 30px;";
			if (window.matchMedia("(max-width: 415px)").matches) {
				margeinfobox = "position: fixed;bottom: 0px;";
			}
		}
		div.style.display= "";
		div.style.position= "fixed";
		div.style.zIndex= "100000";

		if (window.matchMedia("(max-width: 415px)").matches) {
			div.style.bottom = "0";
			div.style.left = "0";
			div.style.right = "0";
			var widthinformandconsent = "100%";
			var borederradiuswidthinformandconsent = 0;
		}
		else {
			div.style.bottom = "30px";
			div.style.left = "30px";
			var widthinformandconsent = "300px";	
			var borederradiuswidthinformandconsent = "5px";		
		}


		// Le code HTML de la demande de consentement
		// Vous pouvez modifier le contenu ainsi que le style
		div.innerHTML =  '<div style="width: '+widthinformandconsent+';'+margeinfobox+' background-color: #edeff5; repeat scroll 0% 0% white; padding :10px 10px;text-align:center;opacity:1;color: #838391;font-family: Roboto, Arial;box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.27058823529411763);border-radius: '+borederradiuswidthinformandconsent+';font-size: 13px!important;" id="inform-and-consent">\
		<div>'+ text_message+' <a href="'+lien_message+'" style="color: #838391">En savoir plus</a></div><div style="padding :20px 10px 10px 10px;text-align:center;"><button style="margin-right:50px;text-decoration:underline;background: none;cursor: pointer;border: none;font-size: smaller;" \
		name="S\'opposer" onclick="tagAnalyticsCNIL.CookieConsent.gaOptout();tagAnalyticsCNIL.CookieConsent.hideInform();" id="optout-button" >S\'opposer</button><button style="background-color: '+couleur_btn+';color: #fff;cursor: pointer;border: none;padding: 5px 20px;border-radius: 4px;" name="cancel" onclick="tagAnalyticsCNIL.CookieConsent.hideInform(); tagAnalyticsCNIL.CookieConsent.acceptercookies()" >Accepter</button></div></div>';
		bodytag.insertBefore(div,bodytag.firstChild); // Ajoute la banniére juste au début de la page 
	}

	  

	function isClickOnOptOut( evt) { // Si le noeud parent ou le noeud parent du parent est la banniére, on ignore le clic
			return(evt.target.parentNode.id == 'inform-and-consent' || evt.target.parentNode.parentNode.id =='inform-and-consent' || evt.target.id == 'optout-button')
	}

	function consent(evt) {
		if(valider_au_clic == true){
			if (!isClickOnOptOut(evt) ) { // On vérifie qu'il ne s'agit pas d'un clic sur la banniére
				if ( !clickprocessed) {
					evt.preventDefault();
					document.cookie = 'hasConsent=true; '+ getCookieExpireDate() +' ; ' +  getCookieDomainName() + ' ; path=/'; 
					callGoogleAnalytics();
					clickprocessed = true;
					window.setTimeout(function() {evt.target.click();}, 1000)
				} 
			}
		}
	}


	// Tag Google Analytics, cette version est avec le tag Universal Analytics
	function callGoogleAnalytics() {
		if (firstCall) return;
		else firstCall = true;
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', gaProperty, 'auto');  // Replace with your property ID.
		ga('send', 'pageview');

		//ajouter du code google analytics ici
	}

	return {

		acceptercookies: function(){
		document.cookie = 'hasConsent=true; '+ getCookieExpireDate() +' ; ' +  getCookieDomainName() + ' ; path=/'; 
					callGoogleAnalytics();
					clickprocessed = true;
		},
		
			// La fonction d'opt-out   
		 gaOptout: function() {
			document.cookie = disableStr + '=true;'+ getCookieExpireDate() + ' ; ' +  getCookieDomainName() +' ; path=/';       
			document.cookie = 'hasConsent=false;'+ getCookieExpireDate() + ' ; ' +  getCookieDomainName() + ' ; path=/';
			var div = document.getElementById('cookie-banner');
			// on considère que le site a été visité
			clickprocessed = true;
			// Ci dessous le code de la bannière affichée une fois que l'utilisateur s'est opposé au dépot
			// Vous pouvez modifier le contenu et le style
			if ( div!= null ) div.innerHTML = '<div style="background-color:#fff;text-align:center;padding:5px;font-size:12px;border-bottom:1px solid #eeeeee;" id="cookie-message"> Vous vous êtes opposé \
			au dépôt de cookies de mesures d\'audience dans votre navigateur </div>'
			window[disableStr] = true;
			deleteAnalyticsCookies();
		},

		
		 showInform: function() {
			var div = document.getElementById("inform-and-ask");
			div.style.display = "";
		},
		  
		  
		 hideInform: function() {
			var div = document.getElementById("inform-and-ask");
			div.style.display = "none";
		},
		
		
		start: function() {
			//Ce bout de code vérifie que le consentement n'a pas déjà été obtenu avant d'afficher
			// la bannière
			var consentCookie =  getCookie('hasConsent');
			clickprocessed = false; 
			if (!consentCookie) {//L'utilisateur n'a pas encore de cookie, on affiche la banniére et si il clique sur un autre élément que la banniére, on enregistre le consentement
				if ( notToTrack() ) { //L'utilisateur a activé DoNotTrack. Do not ask for consent and just opt him out
					tagAnalyticsCNIL.CookieConsent.gaOptout()
					alert("You've enabled DNT, we're respecting your choice")
				} else {
					if (isToTrack() ) { //DNT is set to 0, no need to ask for consent just set cookies
						consent();
					} else {
						if (window.addEventListener) {
						  // Standard browsers
						  window.addEventListener("load", createInformAndAskDiv, false);
						  document.addEventListener("click", consent, false);
						} else {
						  window.attachEvent("onload", createInformAndAskDiv);
						  document.attachEvent("onclick", consent);
						}
					}
				}
			} else {
				if (document.cookie.indexOf('hasConsent=false') > -1) 
					window[disableStr] = true;
				else 
					callGoogleAnalytics();
			}
		}
	}

}();

tagAnalyticsCNIL.CookieConsent.start();