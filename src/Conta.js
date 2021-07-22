/* global selectors, Promise, Wait */

const Conta = {
    saldo: () => {
        let divSaldo = $(selectors.saldo);
        let saldo = !divSaldo.length ? "R$0,00" : divSaldo.text();

        return Number(saldo.replaceAll(/[^0-9,]*/gm, "").replaceAll(",", "."));
    },
    atualizarSaldo: new Promise((success, error)=>{
        Wait.element(selectors.conta_img)
                .then((conta_img)=>{
                    //Clica na imagem da conta
                    $(conta_img).click();
                    Wait.element(selectors.conta_saldo_atualizar)
                            .then((conta_saldo_atualizar)=>{
                                //Clica para atualizar
                                $(conta_saldo_atualizar).click();
                                
                                //Clica de novo na imagem para fechar
                                $(conta_img).click();
                                return success();
                            })
                            .catch(()=>{
                                return error();
                            });
                })
                .catch(()=>{
                    return error();
                });
    }),
    login: new Promise((fezLogin, semLogin) => {
        //Espera o login por no maximo 2 segundos
        Wait.element(selectors.login_Btn, 2000)
                .then((login_Btn) => {
                    //Clica no botão de login
                    login_Btn.click();
                    Wait.sleep(3000).then(() => {
                        Promise.all([Wait.element(selectors.login_User), Wait.element(selectors.login_Password)]).then(() => {
                            Wait.element(selectors.login_BtnModal, 2000)
                                    .then((login_BtnModal) => {
                                        login_BtnModal.click();
                                        return fezLogin();
                                    });
                        });
                    });

                })
                .catch(() => {
                    //Não tem botão de login
                    return semLogin();
                });
    })
};

