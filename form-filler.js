javascript:(function() {
    const dadesJsonString = prompt("Enganxa aquí el teu JSON per omplir el formulari:");
    if (!dadesJsonString) {
        console.log("Operació cancel·lada per l'usuari.");
        return;
    }
    let dadesFormulari;
    try {
        dadesFormulari = JSON.parse(dadesJsonString);
    } catch (e) {
        alert("Error: El text introduït no és un JSON vàlid.");
        console.error("Error parsejant JSON:", e);
        return;
    }

    function omplirFormulariIntern(dades) {
        console.log("Iniciant emplenament del formulari...");

        function setValue(elementId, value, eventType = 'change', isSelect = false) {
            try {
                const element = document.getElementById(elementId);
                if (element) {
                    if (element.type === 'checkbox') {
                        if (element.checked !== value) {
                            element.checked = value;
                            if (typeof element.onclick === 'function') {
                                console.log(`Executant onclick per checkbox ${elementId}`);
                                element.onclick();
                            } else {
                                const event = new Event('change', { bubbles: true, cancelable: true });
                                element.dispatchEvent(event);
                            }
                        }
                    } else if (element.type === 'radio') {
                        const radioGroup = document.getElementsByName(element.name);
                        let foundRadio = false;
                        for (let i = 0; i < radioGroup.length; i++) {
                            if (radioGroup[i].value === value) {
                                if (!radioGroup[i].checked) {
                                    console.log(`Fent clic a radio ${radioGroup[i].id}`);
                                    radioGroup[i].click();
                                }
                                foundRadio = true;
                                break;
                            }
                        }
                        if (!foundRadio) console.warn(`Radio button amb valor ${value} no trobat per al grup ${element.name}`);

                    } else if (isSelect) {
                        let optionFound = false;
                        for (let i = 0; i < element.options.length; i++) {
                            if (element.options[i].value === String(value) || element.options[i].text.trim() === String(value).trim()) {
                                element.selectedIndex = i;
                                optionFound = true;
                                break;
                            }
                        }
                        if (!optionFound) {
                            element.value = value;
                            if (element.value !== String(value)) {
                                console.warn(`Opció amb valor/text "${value}" no trobada per a ${elementId}. S'intenta establir directament.`);
                            }
                        }
                        if (typeof element.onchange === 'function') {
                            console.log(`Executant onchange per select ${elementId}`);
                            element.onchange({target: element, srcElement: element});
                        } else {
                            const event = new Event('change', { bubbles: true, cancelable: true });
                            element.dispatchEvent(event);
                        }
                    } else {
                        element.value = value;
                        if (eventType === 'change' || !eventType) {
                            if (typeof element.onchange === 'function') {
                                console.log(`Executant onchange per ${elementId}`);
                                element.onchange({target: element, srcElement: element});
                            } else {
                                const changeEvent = new Event('change', { bubbles: true, cancelable: true });
                                element.dispatchEvent(changeEvent);
                            }
                        }
                        if (eventType === 'blur') {
                            if (typeof element.onblur === 'function') {
                                console.log(`Executant onblur per ${elementId}`);
                                element.onblur({target: element, srcElement: element});
                            } else {
                                const blurEvent = new Event('blur', { bubbles: true, cancelable: true });
                                element.dispatchEvent(blurEvent);
                            }
                        }
                    }
                    console.log(`Camp ${elementId} establert amb: ${value}`);
                } else {
                    console.warn(`Element amb ID ${elementId} no trobat.`);
                }
            } catch (e) {
                console.error(`Error omplint el camp ${elementId}:`, e.message, e.stack);
            }
        }

        function esperarCondicio(condicioFn, callback, maxIntents = 30, interval = 250, debugMsg = "condició") { // Augmentat interval per defecte
            let intents = 0;
            console.log(`Iniciant espera per: ${debugMsg}`);
            const intervalId = setInterval(() => {
                if (condicioFn() || intents >= maxIntents) {
                    clearInterval(intervalId);
                    if (!condicioFn() && intents >= maxIntents) {
                        console.warn(`Temps d'espera esgotat per: ${debugMsg}`);
                    } else {
                        console.log(`Condició complerta per: ${debugMsg}`);
                    }
                    callback();
                }
                intents++;
            }, interval);
        }

        if (dades.tipusPersona) {
            const radioFisicaId = 'MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_radioPersonaFisica_0';
            const radioJuridicaId = 'MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_radioPersonaJuridica_0';
            if (dades.tipusPersona === "fisica") {
                setValue(radioFisicaId, 'radioPersonaFisica', 'click');
            } else if (dades.tipusPersona === "juridica") {
                setValue(radioJuridicaId, 'radioPersonaJuridica', 'click');
            }
        }

        esperarCondicio(
            () => {
                const cog2El = document.getElementById('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_cog2Text_0');
                if (dades.tipusPersona === "fisica") return cog2El && !cog2El.disabled;
                if (dades.tipusPersona === "juridica") return cog2El && cog2El.disabled;
                return true;
            },
            () => {
                if (dades.documentTipus) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_tipusDocument_0', dades.documentTipus, 'change', true);
                if (dades.documentNumero) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_nifText_0', dades.documentNumero, 'blur');

                if (dades.tipusPersona === "fisica") {
                    if (dades.hasOwnProperty('cognom1')) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_cog1Text_0', dades.cognom1, 'change');
                    if (dades.hasOwnProperty('cognom2')) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_cog2Text_0', dades.cognom2, 'change');
                    if (dades.hasOwnProperty('nom')) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_nomText_0', dades.nom, 'change');
                } else if (dades.tipusPersona === "juridica" && dades.hasOwnProperty('raoSocial')) {
                    setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_cog1Text_0', dades.raoSocial, 'change');
                }
                
                if (dades.pais) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_paisLlista_0', dades.pais, 'change', true);

                esperarCondicio(
                    () => {
                        const cpEl = document.getElementById('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_codiPostaText_0');
                        const municipiTextEl = document.getElementById('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_municipiText_0');
                        if (dades.pais !== "108") return municipiTextEl && !municipiTextEl.readOnly;
                        return cpEl && !cpEl.disabled; // Esperem que el camp CP estigui habilitat
                    },
                    () => {
                        if (dades.codiPostal) {
                            const cpElement = document.getElementById('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_codiPostaText_0');
                            if (cpElement) {
                                cpElement.value = dades.codiPostal;
                                console.log(`CP ${cpElement.id} establert amb: ${dades.codiPostal}`);
                                if (typeof cpElement.onchange === 'function') {
                                    cpElement.onchange({target: cpElement, srcElement: cpElement});
                                }
                                // Disparar 'blur' és crucial aquí per a l'autocompletat
                                if (typeof cpElement.onblur === 'function') {
                                    console.log(`Executant onblur (simulant Tab) per ${cpElement.id}`);
                                    cpElement.onblur({target: cpElement, srcElement: cpElement});
                                } else {
                                    const blurEvent = new Event('blur', { bubbles: true, cancelable: true });
                                    cpElement.dispatchEvent(blurEvent);
                                     const changeEvent = new Event('change', { bubbles: true, cancelable: true });
                                    cpElement.dispatchEvent(changeEvent);
                                }
                            }
                        }
                        
                        esperarCondicio(
                            () => { // Condició: municipiText té valor O municipiLlista (desplegable) té opcions i és visible
                                const municipiTextEl = document.getElementById('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_municipiText_0');
                                const municipiLlistaEl = document.getElementById('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_municipiLlista_0');
                                return (municipiTextEl && municipiTextEl.value.trim() !== "") || 
                                       (municipiLlistaEl && municipiLlistaEl.options.length > 0 && municipiLlistaEl.style.display !== 'none');
                            },
                            () => { // Callback: un cop el municipi s'ha carregat o el desplegable és visible
                                const municipiLlistaEl = document.getElementById('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_municipiLlista_0');
                                if (dades.pais === "108" && municipiLlistaEl && municipiLlistaEl.style.display !== 'none' && dades.municipiValorSelect) {
                                     setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_municipiLlista_0', dades.municipiValorSelect, 'change', true);
                                } else if (dades.pais !== "108") { // Si no és Espanya i s'ha especificat municipiNom (i província)
                                     if (dades.municipiNom) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_municipiText_0', dades.municipiNom);
                                     if (dades.provinciaNom) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_provinciaText_0', dades.provinciaNom);
                                }

                                if (dades.viaTipus) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_tipusVia_0', dades.viaTipus, 'change', true);
                                if (dades.viaNom) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_viaText_0', dades.viaNom);
                                
                                const kmEl = document.getElementById('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_kmText_0');
                                if (dades.hasOwnProperty('km') && dades.km !== "" && kmEl) {
                                    setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_kmText_0', dades.km, 'change');
                                    esperarCondicio(() => !document.getElementById('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_hmText_0').disabled || (dades.km === ""), () => {
                                        if (dades.hasOwnProperty('hm') && dades.hm !== "") setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_hmText_0', dades.hm);
                                    }, 10, 150, "habilitació HM");
                                } else if (dades.hasOwnProperty('viaNumero') && dades.viaNumero !== "") {
                                    setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_numeroText_0', dades.viaNumero, 'change');
                                    esperarCondicio(() => !document.getElementById('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_lletraText_0').disabled || (dades.viaNumero === ""), () => {
                                        if (dades.hasOwnProperty('viaLletra') && dades.viaLletra !== "") setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_lletraText_0', dades.viaLletra);
                                        if (dades.hasOwnProperty('viaNumeroSuperior') && dades.viaNumeroSuperior !== "") setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_numeroSupText_0', dades.viaNumeroSuperior);
                                        if (dades.hasOwnProperty('viaLletraSuperior') && dades.viaLletraSuperior !== "") setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_lletraSupText_0', dades.viaLletraSuperior);
                                    }, 10, 150, "habilitació Lletra");
                                }
                                
                                if (dades.hasOwnProperty('bloc') && dades.bloc !== "") setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_blocText_0', dades.bloc);
                                if (dades.hasOwnProperty('portal') && dades.portal !== "") setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_portalText_0', dades.portal);
                                if (dades.hasOwnProperty('escala') && dades.escala !== "") setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_escalaText_0', dades.escala);
                                if (dades.hasOwnProperty('planta') && dades.planta !== "") setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_plantaText_0', dades.planta);
                                if (dades.hasOwnProperty('porta') && dades.porta !== "") setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_portaText_0', dades.porta);
                                if (dades.hasOwnProperty('pseudovia') && dades.pseudovia !== "") setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_pseudoviaText_0', dades.pseudovia);
                                if (dades.hasOwnProperty('apartatCorreus') && dades.apartatCorreus !== "") setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_apartatCorreusText_0', dades.apartatCorreus);
                        
                                if (dades.telefonFix) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_telefonText_0', dades.telefonFix);
                                if (dades.telefonMobil) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_mobilText_0', dades.telefonMobil, 'change');
                                if (dades.fax) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_faxText_0', dades.fax);
                                if (dades.correuElectronic) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesPersona_ctrlPersones_dadesPersonaRepeater_emailText_0', dades.correuElectronic, 'change');
                        
                                if (dades.exposoText) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesExposicio_exposicioFetsText', dades.exposoText, 'change');
                                if (dades.solicitoText) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesExposicio_solicitoText', dades.solicitoText, 'change');
                        
                                const chkNotificacions = document.getElementById('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesAutoritzacio_notificacionsSi');
                                if (chkNotificacions && dades.hasOwnProperty('autoritzaNotificacions')) {
                                    if (chkNotificacions.checked !== dades.autoritzaNotificacions) {
                                         chkNotificacions.click(); 
                                    }
                                    esperarCondicio(
                                        () => {
                                            const docNotifEl = document.getElementById('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesAutoritzacio_dniText');
                                            return (dades.autoritzaNotificacions && docNotifEl && !docNotifEl.disabled) || (!dades.autoritzaNotificacions && docNotifEl && docNotifEl.disabled);
                                        },
                                        () => {
                                             if (dades.autoritzaNotificacions) {
                                                 if (dades.notificacionsDocumentTipus) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesAutoritzacio_tipusDocument', dades.notificacionsDocumentTipus, 'change', true);
                                                 if (dades.notificacionsDocumentNumero) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesAutoritzacio_dniText', dades.notificacionsDocumentNumero, 'change');
                                                 if (dades.notificacionsCorreuElectronic) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesAutoritzacio_mailText', dades.notificacionsCorreuElectronic, 'change');
                                                 if (dades.notificacionsTelefonMobil) setValue('MainContent_Contingut_ctrlFormulariEspecific_ctrlFormulariGeneric_dadesAutoritzacio_mobilText', dades.notificacionsTelefonMobil, 'change');
                                             }
                                             console.log("Emplenament del formulari completat.");
                                        }, 15, 200, "habilitació camps notificació");
                                } else {
                                     console.log("Emplenament del formulari completat (sense secció de notificacions o checkbox no trobada).");
                                }
                            }, 40, 250, "autocompletat municipi/província"); // Augmentat maxIntents i interval
                    }, 15, 200, "habilitació CP després de canvi de país");
            }, 15, 200, "habilitació camps després de canvi de tipus persona");
    }

    omplirFormulariIntern(dadesFormulari);
})();
