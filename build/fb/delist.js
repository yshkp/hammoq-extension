
if (document.domain == "www.facebook.com" || document.domain == "facebook.com") {
	setTimeout(async() => {
		// setTimeout(() => {
		// 	document.getElementsByClassName("_231w _231z _4yee")[0].click()//delete listing link
		// 	setTimeout(() => {
		// 		document.getElementsByClassName("_43rm")[1].click()//delete button
		// 	},2000)
		// },2000)	
		(await waitForNode('[nextavailability="out_of_stock"]')).dispatch('click');
		(await waitForNode('input[value="DECLINE"]')).prop('checked', true).dispatch('click');
		let button = $('div[data-hover="tooltip"]:contains("Next")');
		button.dispatch('click');
		await waitForNodeDisappear(button);
		// if(document.getElementsByClassName("_6mix _4jy0 _4jy3 _517h _51sy _42ft")[0].getAttribute("nextavailability") == "out_of_stock"){
		//  document.getElementsByClassName("_6mix _4jy0 _4jy3 _517h _51sy _42ft")[0].click();//sold button,else=="in_stock"
		// }
		//  setTimeout(() => {
		//  	document.getElementsByClassName("_3n5s")[0].click();//cancel button
		//  },2000)
	},5000)	
}


//selling
// if (document.domain == "www.facebook.com" || document.domain == "facebook.com") {
// 	setTimeout(() => {
// 		setTimeout(() => {
// 			document.getElementsByClassName("_55pe")[3].click()//manage as per product id
// 			setTimeout(() => {
// 				document.getElementsByTagName("li")[1].click()//66//Delete listing link
// 				setTimeout(() => {
// 					document.getElementsByClassName("_43rm")[1].click()//Delete confirm
// 				},2000)
// 			},2000)
// 		},2000)
// 	},5000)	
// }