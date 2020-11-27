
const actions ={
	SET_allLoginInfo: ({ commit }, data) => {
		commit('set_allLoginInfo', data)
	},
	SET_allUserInfo: ({ commit }, data) => {
		commit('set_allUserInfo', data)
	},
}
export default actions