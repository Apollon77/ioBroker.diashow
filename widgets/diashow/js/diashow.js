/*
	ioBroker.vis diashow Widget-Set

	version: "0.0.1"

	Copyright 2020 Gaudes ralf@gaudes.net
*/
"use strict";

// add translations for edit mode
$.extend(
	true,
	systemDictionary,
	{
		"AutoViewChange":{
			"en": "Enable",
			"de": "Aktivieren",
			"ru": "включить",
			"pt": "Habilitar",
			"nl": "Inschakelen",
			"fr": "Activer",
			"it": "Abilitare",
			"es": "Habilitar",
			"pl": "Włączyć",
			"zh-cn": "启用"
		},
		"AutoViewChange_tooltip":{
			"en": "Enable automatic view change to this view on timeout",
			"de": "Aktivieren Sie die automatische Ansichtsänderung zu dieser Ansicht bei Zeitüberschreitung",
			"ru": "Включить автоматическое изменение представления для этого представления по истечении времени ожидания",
			"pt": "Habilitar mudança automática de visualização para esta visualização no tempo limite",
			"nl": "Schakel automatische weergave van deze weergave bij time-out in",
			"fr": "Activer la modification automatique de la vue de cette vue à l'expiration du délai",
			"it": "Abilita la modifica automatica della vista a questa vista al timeout",
			"es": "Habilitar el cambio de vista automático a esta vista en el tiempo de espera",
			"pl": "Włącz automatyczną zmianę widoku w tym widoku po przekroczeniu limitu czasu",
			"zh-cn": "在超时时启用对此视图的自动视图更改"
		},
		"AutoViewChangeTimeout":{
			"en": "Timeout",
			"de": "Timeout",
			"ru": "Тайм-аут",
			"pt": "Tempo esgotado",
			"nl": "Time-out",
			"fr": "Temps libre",
			"it": "Tempo scaduto",
			"es": "Se acabó el tiempo",
			"pl": "Koniec czasu",
			"zh-cn": "超时"
		},
		"AutoViewChangeTimeout_tooltip":{
			"en": "Inactivity time in seconds to start view with Diashow",
			"de": "Inaktivitätszeit in Sekunden, um die Ansicht mit Diashow zu starten",
			"ru": "Время бездействия в секундах для запуска просмотра с помощью Diashow",
			"pt": "Tempo de inatividade em segundos para iniciar a visualização com Diashow",
			"nl": "Inactiviteitstijd in seconden om de weergave met Diashow te starten",
			"fr": "Temps d'inactivité en secondes pour démarrer la vue avec Diashow",
			"it": "Tempo di inattività in secondi per avviare la visualizzazione con Diashow",
			"es": "Tiempo de inactividad en segundos para comenzar a ver con Diashow",
			"pl": "Czas braku aktywności w sekundach, aby rozpocząć przeglądanie w Diashow",
			"zh-cn": "闲置时间（以秒为单位）以使用Diashow开始查看"
		},
		"AutoViewNavTarget":{
			"en": "Target on click",
			"de": "Ziel beim Klicken",
			"ru": "Таргетинг на клик",
			"pt": "Alvo no clique",
			"nl": "Target op klik",
			"fr": "Cible au clic",
			"it": "Target al clic",
			"es": "Objetivo al hacer clic",
			"pl": "Cel po kliknięciu",
			"zh-cn": "点击目标"
		},
		"AutoViewNavTarget_tooltip":{
			"en": "Target when click to leave Diashow",
			"de": "Ziel beim Klicken, um Diashow zu verlassen",
			"ru": "Таргетинг при нажатии для выхода из Diashow",
			"pt": "Alvo ao clicar para sair do Diashow",
			"nl": "Richt wanneer u klikt om Diashow te verlaten",
			"fr": "Cibler lorsque vous cliquez pour quitter Diashow",
			"it": "Target quando si fa clic per uscire da Diashow",
			"es": "Apunte al hacer clic para salir de Diashow",
			"pl": "Wyceluj po kliknięciu, aby opuścić Diashow",
			"zh-cn": "单击以离开Diashow时定位"
		},
		"AutoViewTarget":{
			"en": "Target view",
			"de": "Zielansicht",
			"ru": "Целевой вид",
			"pt": "Visão de alvo",
			"nl": "Doelweergave",
			"fr": "Vue cible",
			"it": "Vista di destinazione",
			"es": "Vista de destino",
			"pl": "Widok docelowy",
			"zh-cn": "目标视图"
		},
		"AutoViewTarget_tooltip":{
			"en": "Target view when leave Diashow with click on picture",
			"de": "Zielansicht beim Verlassen von Diashow mit Klick auf Bild",
			"ru": "Целевой вид при выходе из Diashow с щелчком по картинке",
			"pt": "Visualização desejada ao sair do Diashow clicando na imagem",
			"nl": "Target view wanneer u Diashow verlaat met klik op de foto",
			"fr": "Vue cible lorsque vous quittez Diashow en cliquant sur l'image",
			"it": "Vista di destinazione quando si esce da Diashow con un clic sull'immagine",
			"es": "Vista de destino al salir de Diashow haciendo clic en la imagen",
			"pl": "Docelowy widok po wyjściu z Diashow, klikając na zdjęcie",
			"zh-cn": "单击图片离开Diashow时的目标视图"
		},
		"DiaShowEffect":{
			"en": "Effect style",
			"de": "Effektstil",
			"ru": "Стиль эффекта",
			"pt": "Estilo de efeito",
			"nl": "Effect stijl",
			"fr": "Style d'effet",
			"it": "Stile effetto",
			"es": "Estilo de efecto",
			"pl": "Styl efektu",
			"zh-cn": "效果风格"
		},
		"DiaShowEffect_tooltip":{
			"en": "Basic effect when picture changes",
			"de": "Grundeffekt bei Bildänderungen",
			"ru": "Основной эффект при смене изображения",
			"pt": "Efeito básico quando a imagem muda",
			"nl": "Basiseffect wanneer het beeld verandert",
			"fr": "Effet de base lorsque l'image change",
			"it": "Effetto di base quando l'immagine cambia",
			"es": "Efecto básico cuando cambia la imagen",
			"pl": "Podstawowy efekt przy zmianie obrazu",
			"zh-cn": "图片变化时的基本效果"
		},
		"group_effect":{
			"en": "Effect",
			"de": "Effekt",
			"ru": "Эффект",
			"pt": "Efeito",
			"nl": "Effect",
			"fr": "Effet",
			"it": "Effetto",
			"es": "Efecto",
			"pl": "Efekt",
			"zh-cn": "影响"
		},
		"EffectNone":{
			"en": "None",
			"de": "Kein",
			"ru": "никто",
			"pt": "Nenhum",
			"nl": "geen",
			"fr": "aucun",
			"it": "nessuna",
			"es": "ninguna",
			"pl": "Żaden",
			"zh-cn": "没有"
		},
		"EffectFade":{
			"en": "Fade",
			"de": "Fade",
			"ru": "Fade",
			"pt": "Fade",
			"nl": "Fade",
			"fr": "Fade",
			"it": "Fade",
			"es": "Fade",
			"pl": "Fade",
			"zh-cn": "Fade"
		},
		"EffectTransition":{
			"en": "Transition",
			"de": "Transition",
			"ru": "Transition",
			"pt": "Transition",
			"nl": "Transition",
			"fr": "Transition",
			"it": "Transition",
			"es": "Transition",
			"pl": "Transition",
			"zh-cn": "Transition"
		},
		"EffectJQuery":{
			"en": "JQuery Effect",
			"de": "JQuery-Effekt",
			"ru": "Эффект JQuery",
			"pt": "Efeito JQuery",
			"nl": "JQuery-effect",
			"fr": "Effet JQuery",
			"it": "Effetto JQuery",
			"es": "Efecto JQuery",
			"pl": "Efekt JQuery",
			"zh-cn": "jQuery效果"
		},
		"FadeTime":{
			"en": "transition period",
			"de": "Übergangsphase",
			"ru": "переходный период",
			"pt": "período de transição",
			"nl": "overgangsperiode",
			"fr": "période de transition",
			"it": "periodo di transizione",
			"es": "periodo de transicion",
			"pl": "okres przejściowy",
			"zh-cn": "过渡期"
		},
		"FadeTime_tooltip":{
			"en": "Time in ms for transition period, for example from being shown to being hidden",
			"de": "Zeit in ms für die Übergangszeit, zum Beispiel vom Anzeigen zum Ausblenden",
			"ru": "Время в мс для переходного периода, например, от отображения до скрытия",
			"pt": "Tempo em ms para o período de transição, por exemplo, de ser mostrado para ser escondido",
			"nl": "Tijd in ms voor overgangsperiode, bijvoorbeeld van getoond naar verborgen",
			"fr": "Temps en ms pour la période de transition, par exemple entre l'affichage et le masquage",
			"it": "Tempo in ms per il periodo di transizione, ad esempio da essere mostrato a essere nascosto",
			"es": "Tiempo en ms para el período de transición, por ejemplo, desde que se muestra hasta que se oculta",
			"pl": "Czas w ms okresu przejścia, na przykład od pokazania do ukrycia",
			"zh-cn": "过渡周期（以毫秒为单位）的时间，例如从显示到隐藏"
		},
		"EffectTransitionStyle":{
			"en": "Transition Style",
			"de": "Transitionsstil",
			"ru": "Transition Style",
			"pt": "Transition Style",
			"nl": "Transition Style",
			"fr": "Transition Style",
			"it": "Transition Style",
			"es": "Transition Style",
			"pl": "Transition Style",
			"zh-cn": "Transition Style"
		},
		"EffectTransitionStyle_tooltip":{
			"en": "Speed curve of the transition",
			"de": "Geschwindigkeitskurve des Übergangs",
			"ru": "Кривая скорости перехода",
			"pt": "Curva de velocidade da transição",
			"nl": "Snelheidscurve van de overgang",
			"fr": "Courbe de vitesse de la transition",
			"it": "Curva di velocità della transizione",
			"es": "Curva de velocidad de la transición",
			"pl": "Krzywa prędkości przejścia",
			"zh-cn": "过渡速度曲线"
		},
		"TargetDefined":{
			"en": "Configured view",
			"de": "Konfigurierte Ansicht",
			"ru": "Настроенный вид",
			"pt": "Vista configurada",
			"nl": "Geconfigureerde weergave",
			"fr": "Vue configurée",
			"it": "Vista configurata",
			"es": "Vista configurada",
			"pl": "Widok skonfigurowany",
			"zh-cn": "配置视图"
		},
		"TargetLast":{
			"en": "Last used view",
			"de": "Zuletzt verwendete Ansicht",
			"ru": "Последний использованный просмотр",
			"pt": "Última visualização usada",
			"nl": "Laatst gebruikte weergave",
			"fr": "Dernière vue utilisée",
			"it": "Ultima visualizzazione utilizzata",
			"es": "Última vista utilizada",
			"pl": "Ostatnio używany widok",
			"zh-cn": "上次使用的视图"
		},
		"TargetNone":{
			"en": "None",
			"de": "Kein",
			"ru": "никто",
			"pt": "Nenhum",
			"nl": "geen",
			"fr": "aucun",
			"it": "nessuna",
			"es": "ninguna",
			"pl": "Żaden",
			"zh-cn": "没有"
		},
		"group_viewchange":{
			"en": "Automatic Diashow start",
			"de": "Automatischer Diashow-Start",
			"ru": "Автоматический запуск диашоу",
			"pt": "Início automático do Diashow",
			"nl": "Automatische Diashow-start",
			"fr": "Démarrage automatique de Diashow",
			"it": "Avvio automatico del Diashow",
			"es": "Inicio automático de Diashow",
			"pl": "Automatyczny start Diashow",
			"zh-cn": "自动Diashow启动"
		} 
	}
);

// this code can be placed directly in diashow.html
vis.binds["diashow"] = {
	version: "0.0.1",
	showVersion: function () {
		if (vis.binds["diashow"].version) {
			console.log("Version diashow: " + vis.binds["diashow"].version);
			vis.binds["diashow"].version = null;
		}
	},
	initDiashowTimer: function (view){
		if (!vis.views && !vis.editMode) {
			return setTimeout(function () {
				vis.binds["diashow"].initDiashowTimer();
			}, 100);
		}
		function DiaShowTimeout(TimeoutTime = 15000){
			if (vis.actualView !== window.DiaShowView){
				if (window.DiaShowTimer) clearTimeout(window.DiaShowTimer);
				window.DiaShowLastView = vis.activeView;
				window.DiaShowTimer = setTimeout(function(){
					window.DiaShowTimer = null;
					window.DiaShowTimeoutStarted = false;
					vis.changeView(window.DiaShowView);
					DiaShowTimeout(TimeoutTime);
				}, TimeoutTime);
			}
		}

		if (!vis.editMode && !window.DiaShowTimeoutStarted){
			// Searching view with Diashow
			for (view in vis.views){
				if (vis.views[view].widgets){ 
					for (const widgetid in vis.views[view].widgets){
						if (vis.views[view].widgets[widgetid].tpl === "tplDiashowPicture"){
							if (vis.views[view].widgets[widgetid].data.AutoViewChange === true){ 
								console.log("DiaShowTimeout started");
								window.DiaShowTimeoutStarted = true;
								window.DiaShowView = view;
								$(document).click(DiaShowTimeout(vis.views[view].widgets[widgetid].data.AutoViewChangeTimeout * 1000));
								DiaShowTimeout(vis.views[view].widgets[widgetid].data.AutoViewChangeTimeout * 1000);
							}	
						}  
					}
				}
			}
		}
	},
	showDiashow: function (widgetID, view, data, style){
		var $div = $("#" + widgetID);
		// if nothing found => wait
		if (!$div.length) {
			return setTimeout(function () {
				vis.binds["diashow"].showDiashow(widgetID, view, data, style);
			}, 100);
		}
		console.log("Integrating Diashow");
		let FadeTime = parseInt(data.FadeTime) || 0;

		function onChange(e, newVal, oldVal) {
			switch(data.DiashowEffect){
				case "EffectFade":
					$('.diashowpicture1').fadeOut(FadeTime, function() {
                        $('.diashowpicture1').attr("src", newVal).load(function(){
                    		$('.diashowpicture1').fadeIn(FadeTime);
                        });
					});
					break;
				case "EffectTransition":
					$(".diashowpicturehidden").attr("src", newVal);
					$(".diashowpicture").toggleClass("diashowpicturehidden");
					break;
				case "EffectJQuery":
					console.log(`Starting effect ${data.EffectJQuery}`)
					if ($(".diashowpicture2").css("display") === "none"){
						$(".diashowpicture2").attr("src", newVal);
						$(".diashowpicture2").css("z-index", 2);
						$(".diashowpicture2").show(data.EffectJQuery, data.EffectTransitionStyle, FadeTime, function() {$(".diashowpicture1").css("display", "none");} )
					} else{
						$(".diashowpicture1").attr("src", newVal);
						$(".diashowpicture2").css("z-index", 0);
						$(".diashowpicture1").show(data.EffectJQuery, data.EffectTransitionStyle, FadeTime, function() {$(".diashowpicture2").css("display", "none");} )
					}
					break;
				default:
					$(".diashowpicture1").attr("src", newVal);
					break;
			}
		}

		$div.on('click touchend', function (e) {
			// Protect against two events
			if (vis.detectBounce(this)) return;
			if (data.AutoViewNavTarget === "TargetLast"){
				vis.changeView(window.DiaShowLastView);
			}else if(data.AutoViewNavTarget === "TargetDefined"){
				vis.changeView(data.AutoViewTarget);
			}
		});

		if (data.oid){ 
			vis.states.bind(data.oid + ".val", onChange);
		}
		if (data.DiashowEffect === "EffectFade"){
			$(".diashowpicture2").css("display", "none");
		}
		if (data.DiashowEffect === "EffectTransition"){
			$(".diashowpicture2").addClass("diashowpicturehidden");
			$(".diashowpicturehidden").css("transition-property", "opacity");
			$(".diashowpicturehidden").css("transition-duration", FadeTime + "ms");
			$(".diashowpicturehidden").css("transition-timing-function", data.EffectTransitionStyle);
			$(".diashowpicturehidden").css("transition-delay", "0s");
			$(".diashowpicture").css("transition-property", "opacity");
			$(".diashowpicture").css("transition-duration", FadeTime + "ms")
			$(".diashowpicture").css("transition-timing-function", data.EffectTransitionStyle);
			$(".diashowpicture").css("transition-delay", "0s");
		}
		if (data.DiashowEffect === "EffectJQuery"){
			$(".diashowpicture2").css("display", "none");
		}
	}
};
vis.binds["diashow"].showVersion();
vis.binds["diashow"].initDiashowTimer();