import React, { useState, useEffect } from "react";
import { SafeAreaView, View, TouchableOpacity, StyleSheet, FlatList, Dimensions, Text } from "react-native";
import { Colors, ImagePath, Label, Size, Typography, Icon, Strings } from "../../constants";
import { AlertError, Button, Loader, RowColumn, SocialButton, ToastSuccess } from "../../components";
import { instance } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { logoutSucces, setCounrtyData } from "../../features";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";
import { useDrawerStatus } from "@react-navigation/drawer";

const { width, height } = Dimensions.get('window');

export default DrawerMenu = ({ navigation }) => {

	const [isLoading, setIsLoading] = useState(false);
	const [subCatToggle, setSubCatToggle] = useState(false);
	const [cat, setCat] = useState();
	const [subCat, setSubCat] = useState();
	const [categoriesList, setCategoriesList] = useState([]);
	const dispatch = useDispatch();
	const authData = useSelector((state) => state.auth);
	const countryData = useSelector((state) => state.country);
	const profileImage = authData.data?.profile_image;
	const wasDrawerOpen = useDrawerStatus();


	useEffect(() => {
		async function fatchData() {
			if (wasDrawerOpen == "open") {
				let getCountryName = await AsyncStorage.getItem('countryName');
				let getCityName = await AsyncStorage.getItem('cityName');
				if ((countryData?.country?.country_name !== getCountryName || (countryData?.country?.city_name !== getCityName && getCityName !== null))) {
					getMenuList();
				}
			}
			if (wasDrawerOpen == "closed") {
				await AsyncStorage.setItem('countryName', countryData?.country?.country_name)
				await AsyncStorage.setItem('cityName', countryData?.country?.city_name)
			}
		}
		fatchData();
	}, [wasDrawerOpen]);

	useEffect(() => {
		setCat('')
		getMenuList();
	}, [])

	const getMenuList = () => {
		setIsLoading(true);
		instance.post('/get_menus', {
			req: { "data": {} }
		}).then(async (response) => {
			const userData = JSON.parse(response.data);
			if (userData.status === 'success') {
				setCategoriesList(userData?.result);
				setIsLoading(false);
			}
			else {
				setIsLoading(false);
			}
		}).catch(error => {
			navigation.navigate('CatchError');
			AlertError(Strings.Other.catchError);
			setIsLoading(false);
			console.log("getMenuList=====catch====", error)
		});
	};

	const otherData = [
		{
			'id': 1,
			'title': 'FAQ',
			'icon': ImagePath.Drawer.faq,
			'goto': 'Faq',
			'param': 'Faq'
		},
		{
			'id': 2,
			'title': 'Return Policy',
			'icon': ImagePath.Drawer.return,
			'goto': 'Cms',
			'param': 'refund-policy'
		},
		{
			'id': 3,
			'title': 'Privacy Policy',
			'icon': ImagePath.Drawer.policy,
			'goto': 'Cms',
			'param': 'privacy-policy'
		},
		{
			'id': 33,
			'title': 'Contact Us',
			'icon': ImagePath.Drawer.contact,
			'goto': 'Cms',
			'param': 'contact-us'
		},
		{
			'id': 4,
			'title': 'Terms & conditions',
			'icon': ImagePath.Drawer.customer,
			'goto': 'Cms',
			'param': 'terms-and-conditions'
		},
	];

	const goToNav = (screenName, param = '', title = '') => {
		navigation.closeDrawer();
		setCat('')
		setSubCat('')
		navigation.navigate(screenName, (param && { requestPage: param, pageTitle: title }));
	}

	const logOut = async () => {
		dispatch(logoutSucces())
		navigation.closeDrawer()
		setCat('')
		setSubCat('')
		await AsyncStorage.setItem("userData", '')
		await AsyncStorage.setItem("logoutMessage", 'true')
		ToastSuccess("Logout successfully")
		navigation.navigate('BlankScreen', { "goto": 'Home' })
	}

	const filterName = (name) => {
		return name;
	}

	const gotoScreen = async (item) => {
		console.log('item=====',item);
		
		if (item.url == '') {
			return '';
		}
		navigation.closeDrawer();

		if (item.url_type !== "static" && item.url_type !== "product" && item?.url !== "/" && item?.url !== "in/valentines-day") {
			if (item?.page_type == "landing") {
				let oldCountryData = countryData.country
				let newCountryData;
				if (item?.city_data?.country_data) {
					newCountryData = {
						"city_name": item?.city_data?.city_name ? item?.city_data?.city_name : '',
						"city_id": item?.city_data?._id ? item?.city_data?._id : '',
						"country_id": item?.city_data?.country_data?._id ? item?.city_data?.country_data?._id : '',
						"country_image": item?.city_data?.country_data?.country_image ? item?.city_data?.country_data?.country_image : '',
						"country_name": item?.city_data?.country_data?.country_name ? item?.city_data?.country_data?.country_name : '',
						"country_iso_code": item?.city_data?.country_data?.country_iso_code ? item?.city_data?.country_data?.country_iso_code : '',
						"isFromLandingPage": true,
					}
				} else if (item?.country_data != {}) {
					newCountryData = {
						"city_name": '',
						"city_id": '',
						"country_id": item.country_data?._id ? item.country_data?._id : '',
						"country_image": item.country_data?.country_image ? item.country_data?.country_image : '',
						"country_name": item.country_data?.country_name ? item.country_data?.country_name : '',
						"country_iso_code": item.country_data?.country_iso_code ? item.country_data?.country_iso_code : '',
						"menu_url": item, //new key add
						"isFromLandingPage": true,
					}
				}
				let currCountryData = { ...oldCountryData, ...newCountryData };
				await dispatch(setCounrtyData(currCountryData))
			}
			navigation.navigate((item?.page_type == "landing" ? 'BlankScreen' : 'Listing'), { "menu_url": item, "goto": 'Landing' })
		}
		else if (item.url_type === "product" || item?.url == "/") {
			(item.slug) ? navigation.navigate("Detail", { "productSlug": item.slug }) : navigation.navigate("Home", { "menu_url": item })
		}
		else if (item.url_type === "static") {
			navigation.navigate("Detail", { "menu_url": item })
		}else if(item?.url == "in/valentines-day"){
			navigation.navigate("ValentineDay", { "menu_url": item })
		}
		setCat('');
		setSubCat('');
	}

	const toggleSubCat = (sub) => {
		sub._id === subCat ? setSubCatToggle(!subCatToggle) : setSubCatToggle(true)
		sub.child_menu?.length == 0 ? gotoScreen(sub.menu_url) : setSubCat(sub._id);
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={[style.welcomemsg, { paddingVertical: 12, paddingHorizontal: 17 }]}>
				<TouchableOpacity hitSlop={style.closeDrawerHitSlop} onPress={() => { navigation.closeDrawer() }} >
					<Icon source={ImagePath.webIcons.left_arrowNew} style={style.icon} />
				</TouchableOpacity>

				<TouchableOpacity onPress={() => { navigation.navigate('AccountStack', { screen: 'MyProfile', params: { 'flow': 'Drawer', } }) }}
					style={style.profileIcon} activeOpacity={0.7} hitSlop={style.hitSlop}>
					<FastImage
						style={{
							width: 27,
							height: 27,
							borderRadius: 100,
						}}
						source={authData.data?.slug ? (profileImage == undefined || profileImage === "") ? ImagePath.webIcons.empty_user : {
							uri: profileImage,
							priority: FastImage.priority.high,
							cache: FastImage.cacheControl.immutable
						} : ImagePath.webIcons.empty_user}
						resizeMode={FastImage.resizeMode.cover}
						onError={(e) => { }}
					/>
				</TouchableOpacity>
				<Label style={[style.useName, { marginLeft: authData.data?.full_name ? 8 : 16, }]} text={authData.data?.slug ? authData.data?.full_name : "Hi Guest !"} />
			</View>

			<View style={[style.welcomemsg, { borderTopWidth: 0.7, borderColor: Colors.BorderColor }]}>
				<RowColumn
					touchableStyle={style.trackOrderView}
					Image={ImagePath.Other.track_order_menu}
					style={{ width: 17, height: 17 }}
					label={Strings.Other.trackOder}
					labelStyle2={{ fontSize: 13, marginLeft: 9 }}
				/>

				<RowColumn
					onClick={() => goToNav('Cms', 'contact-us', 'Contact Us')}
					touchableStyle={[style.trackOrderView, { borderRightWidth: 0 }]}
					Image={ImagePath.Other.customer_service_icon}
					style={{ width: 17, height: 17 }}
					label={Strings.Other.customerCare}
					labelStyle2={{ fontSize: 13, marginLeft: 9 }}
				/>
			</View>

			{isLoading ?
				<View style={{ flex: 1 }}>
					<Loader />
				</View> :
				<FlatList
					data={categoriesList}
					renderItem={({ item, index }) => {
						if (item.status == 1 && item.is_deleted == 0 && item.menu_type == "text" && categoriesList?.length > 0) {
							return (
								<View key={item._id}>
									{item._id === cat ?
										< RowColumn
											onClick={() => setCat('')}
											touchableStyle={{ paddingVertical: 15, borderBottomWidth: 1, borderColor: Colors.Gallery, width: '100%' }}
											style={[style.shapeIcon, { tintColor: Colors.Concord, marginRight: 0 }]}
											label={filterName(item?.menu_mobile_name)}
											labelStyle2={[style.label, { color: Colors.BorderColor, marginLeft: 10 }]}
											Image={ImagePath.webIcons.left_arrowNew}
											ImageStyle={style.selectTedMenu}
										/>
										:
										!cat && < RowColumn
											onClick={() => {
												setCat(item._id);
												setSubCat('');
												item.child_menu.length == 0 ? gotoScreen(item.menu_url) : '';
											}}
											touchableStyle={[style.dropdownContainer, { borderTopWidth: index === 0 ? 0 : 1 }]}
											style={[style.shapeIcon, { tintColor: item.child_menu.length > 0 ? item._id === cat ? Colors.Black : Colors.Black : (item._id === cat && subCat == '') ? Colors.Concord : Colors.White }]}
											label={filterName(item?.menu_mobile_name)}
											labelStyle2={style.label}
											Image={item.child_menu.length > 0 ? item._id === cat ? ImagePath.webIcons.left_arrowNew : ImagePath.Other.rightarrows : ImagePath.Other.blankImage}
										/>}
									{item._id === cat && item?.child_menu?.length > 0 && item?.child_menu?.map((sub) => (
										sub.menu_type == "text" &&
										<View key={sub._id}>
											<RowColumn
												onClick={() => toggleSubCat(sub)}
												touchableStyle={style.dropdownContainer}
												style={style.plusIconAndMinusIcon}
												label={filterName(sub.menu_mobile_name)}
												labelStyle2={[style.label, { color: (sub._id === subCat && subCatToggle) ? Colors.BorderColor : Colors.Black }]}
												Image={sub.child_menu.length > 0 ? (sub._id === subCat && subCatToggle) ? ImagePath.Other.minusIcon : ImagePath.Other.plusIcon : ImagePath.Other.blankImage}
											/>

											{(sub._id === subCat && sub.child_menu.length > 0 && subCatToggle) && sub.child_menu?.map((subItem, index) => (
												subItem.menu_type == "text" &&
												<View key={subItem._id}>

													<RowColumn

														onClick={() => { gotoScreen(subItem?.menu_url) }}
														touchableStyle={[
															style.dropdownContainer, {
																flexDirection: 'row',
																backgroundColor: 'white',
																borderBottomWidth: 0
															}
														]}
														label={filterName(subItem.menu_mobile_name)}
														style={style.shapeIcon}
														labelStyle2={[style.label, { fontFamily: Typography.LatoRegular }]}
													/>
												</View>
											))}
										</View>
									))}
								</View>
							);
						}
					}}
				/>}

			<View style={style.bottomContainer}>
				<SocialButton source={ImagePath.Auth.fbSign} title={Strings.SignIn.signInWithFB} />
				<SocialButton source={ImagePath.Auth.googleIcon} title={Strings.SignIn.signInWithGoogle} style={style.socialBtn} />
				<Button
					onPress={() => { !authData.data?.slug ? goToNav('Login') : logOut() }}
					style={style.loginSignupButton}
					labelStyle={style.loginSignupButtonLable}
					title={!authData.data?.slug ? "Login" : "Logout"}
					primaryButton
				/>
			</View>

			{/* <View style={style.otherLink}>
					<FlatList
						data={otherData}
						scrollEnabled={false}
						numColumns={2}
						renderItem={({ item, index }) =>
							<TouchableOpacity style={{
								marginHorizontal: 21,
								marginTop: 17,
								flexDirection: "row",
								alignItems: "center",
								flex: 1,
								paddingLeft: (index == 1 || index == 3 || index == 5) ? 10 : 0
							}} onPress={() => { item.title == "Logout" ? logOut() : goToNav(item.goto, item.param, item.title) }} activeOpacity={0.7}>
								<Label text={item.title} style={{
									fontSize: 15,
									color: Colors.Black,
								}} />
							</TouchableOpacity>
						}
					/>
					<Spacer />
				</View> */}
		</SafeAreaView>
	)
};

const style = StyleSheet.create({
	trackOrderView: {
		backgroundColor: Colors.WhiteLinen,
		padding: 8,
		width: width * 0.400,
		justifyContent: 'center',
		borderRightWidth: 0.7,
		borderColor: Colors.BorderColor
	},
	otherLinkItem: {
		flex: 1,
		paddingLeft: Size.l,
		paddingVertical: 13
	},
	otherLink: {
		borderTopWidth: 0.5,
		borderColor: Colors.Silver,
	},
	spacerTop: {
		marginTop: Size.l,
	},
	shopByCollections: {
		padding: Size.l,
		borderTopWidth: 0.5,
		borderColor: Colors.Black,
	},
	loginSignupButtonLable: {
		color: Colors.Secondary.Black,
		fontFamily: Typography.LatoMedium,
	},
	loginSignupButton: {
		marginHorizontal: Size.l,
		paddingVertical: 10,
		height: null,
		backgroundColor: Colors.White,
		marginBottom: 15
	},
	profileIcon: {
		alignItems: 'flex-start',
		marginLeft: 23,
		borderRadius: Size.x100,
		borderColor: Colors.Secondary.Black,
	},
	welcomemsg: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	welcomemsgRight: {
		flexDirection: 'column',
		paddingLeft: Size.m0,
	},
	welcomemsgRightBottom: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		marginTop: Size.m0
	},
	closeDrawerContainer: {
		marginTop: Size.xm2,
		alignItems: 'flex-end',
		width: '93%',
	},
	closeDrawerHitSlop: {
		top: Size.xm,
		bottom: Size.xm,
		left: Size.xm,
		right: Size.xm
	},
	icon: {
		width: 18,
		height: 19,
	},
	useName: {
		fontFamily: Typography.LatoRegular,
		fontSize: 15,
		flex: 1
	},
	labelStyle: {
		fontSize: Size.l - 1
	},
	listIcon: {
		width: 30,
		height: 30
	},
	dropdownContainer: {
		justifyContent: "space-between",
		flexDirection: 'row-reverse',
		width: '100%',
		borderBottomWidth: 1,
		borderColor: Colors.Gallery,
		paddingVertical: 15
	},
	shapeIcon: {
		width: Size.m0,
		height: Size.m0,
		top: 1,
		marginRight: 13,
	},
	plusIconAndMinusIcon: {
		width: 11,
		height: 11,
		top: 1,
		marginRight: 12,
	},
	label: {
		fontSize: 14,
		marginLeft: 15,
		fontFamily: Typography.NunitoBold
	},
	selectTedMenu: {
		borderRightWidth: 1,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 13,
		paddingRight: 20,
		borderColor: Colors.BorderColor
	},
	bottomContainer: {
		backgroundColor: Colors.Black,
		width: '100%'
	},
	socialBtn: {
		marginTop: Size.m1,
		marginBottom: Size.m1
	},
});