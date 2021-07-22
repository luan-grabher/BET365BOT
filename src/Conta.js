/* global selectors, Promise, Wait */

const Conta = {
    saldo: () => {
        let divSaldo = $(selectors.saldo);
        let saldo = !divSaldo.length ? "R$0,00" : divSaldo.text();

        return Number(saldo.replaceAll(/[^0-9,]*/gm, "").replaceAll(",", "."));
    },
    atualizarSaldo: () => {
        return new Promise((success, error) => {
            return success();
            /*Wait.element(selectors.conta_img)
                    .then((conta_img) => {
                        //Clica na imagem da conta
                        $(conta_img).click();
                        debug("Clicou na imagem da conta");
                        Wait.element(selectors.conta_saldo_atualizar)
                                .then((conta_saldo_atualizar) => {
                                    //Clica para atualizar
                                    $(conta_saldo_atualizar).click();
                                    debug("Clicou para atualizar o saldo");
                                    //Clica de novo na imagem para fechar
                                    $(selectors.telaPrincipal).click();
                                    debug("Aplicou focus na imagem da conta");
                                    return success();
                                })
                                .catch(() => {
                                    return error();
                                });
                    })
                    .catch(() => {
                        return error();
                    });*/
        });
    },
    login: () => {
        return new Promise((fezLogin, semLogin) => {
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
    }
};

