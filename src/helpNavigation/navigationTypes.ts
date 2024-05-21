export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    Main: undefined;
    EditProfile: { user: object };
    EditPassword: undefined;
    CreateInvestition: undefined;
    // Edit: undefined;
    InvestitionDetails: { investitionId: number };
};

export type DrawerParamList = {
    Home: undefined;
    Profile: undefined;
    CreateInvestition: undefined;
    // NewWrite: undefined;
};