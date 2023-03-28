export function createDataStore() {
    return {
        // Loading flag
        loading: false,
        setLoading(loading) {
            this.loading = loading;
        },

           //Token
           token:localStorage.getItem("token"),
           setToken(token) {
               console.log("tokens", token);
               this.token = localStorage.getItem("token");
           },
           removeToken() {
               this.token = "";
           },
    };
}
