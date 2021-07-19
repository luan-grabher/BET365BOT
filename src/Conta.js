/* global selectors */

const Conta = {
    saldo: () => {
        let divSaldo = $(selectors.saldo);
        let saldo = !divSaldo.length ? "R$0,00" : divSaldo.text();

        return Number(saldo.replaceAll(/[^0-9,]*/gm, "").replaceAll(",", "."));
    },
    login: new Promise((fezLogin, semLogin) => {
        //Espera o login por no maximo 2 segundos
        Wait.element(selectors.login_Btn, 2000)
                .then((login_Btn) => {
                    //Clica no botão de login
                    login_Btn.click();
                    Wait.sleep(3000).then(() => {
                        Promise.all([Wait.element(selectors.login_User, 5000), Wait.element(selectors.login_Password, 5000)]).then(() => {
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

