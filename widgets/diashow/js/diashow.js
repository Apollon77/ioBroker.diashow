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
		"EffectTransitionStyle":{
			"en": "Transition Style",
			"de": "Transition Style",
			"ru": "Transition Style",
			"pt": "Transition Style",
			"nl": "Transition Style",
			"fr": "Transition Style",
			"it": "Transition Style",
			"es": "Transition Style",
			"pl": "Transition Style",
			"zh-cn": "Transition Style"
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
	showDiashow: function (widgetID, view, data, style){
		var $div = $("#" + widgetID);
		// if nothing found => wait
		if (!$div.length) {
			return setTimeout(function () {
				vis.binds["diashow"].showDiashow(widgetID, view, data, style);
			}, 100);
		}
		console.log("Integrating Diashow");
		function onChange(e, newVal, oldVal) {
			switch(data.DiashowEffect){
				case "EffectFade":
					$('.diashowpicture1').fadeOut(data.FadeTime, function() {
                        $('.diashowpicture1').attr("src", newVal).load(function(){
                    		$('.diashowpicture1').fadeIn(data.FadeTime);
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
						$(".diashowpicture2").show(data.EffectJQuery, data.EffectTransitionStyle, data.FadeTime, function() {$(".diashowpicture1").css("display", "none");} )
					} else{
						$(".diashowpicture1").attr("src", newVal);
						$(".diashowpicture2").css("z-index", 0);
						$(".diashowpicture1").show(data.EffectJQuery, data.EffectTransitionStyle, data.FadeTime, function() {$(".diashowpicture2").css("display", "none");} )
					}
					break;
				default:
					$(".diashowpicture1").attr("src", newVal);
					break;
			}
		}
		if (data.oid){ 
			vis.states.bind(data.oid + ".val", onChange);
		}
		if (data.DiashowEffect === "EffectTransition"){
			$(".diashowpicture2").addClass("diashowpicturehidden");
			$(".diashowpicturehidden").css("transition-duration", data.FadeTime + "ms");
			$(".diashowpicturehidden").css("transition-timing-function", data.EffectTransitionStyle);
			$(".diashowpicture").css("transition-duration", data.FadeTime + "ms")
			$(".diashowpicture").css("transition-timing-function", data.EffectTransitionStyle);
		}
		if (data.DiashowEffect === "EffectJQuery"){
			$(".diashowpicture2").css("display", "none");
		}
	}
};
vis.binds["diashow"].showVersion();