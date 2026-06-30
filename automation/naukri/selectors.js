export default {
    login: {
        email: "#usernameField",
        password: "#passwordField",
        submit: 'button[data-ga-track*="login"]',
    },

    profile: {
        headlineEdit: "#lazyResumeHead .edit",
        headlineView: "#lazyResumeHead .profileHeadline",
        headlineInput: "#resumeHeadlineTxt",
        headlineSave: 'form[name="resumeHeadlineForm"] button[type="submit"]',
    },

    urls: {
        login: "https://www.naukri.com/nlogin/login",
        home: "**/mnjuser/homepage",
        profile: "https://www.naukri.com/mnjuser/profile",
    },
};