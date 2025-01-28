import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, TouchableOpacity, StyleSheet, FlatList, Dimensions } from "react-native";
import { Colors, ImagePath, Label, Size, Spacer, Typography, Icon, Strings } from "../../constants";
import { AlertError, Button, Loader, RowColumn, ToastSuccess } from "../../components";
import { instance } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { logoutSucces, setCounrtyData } from "../../features";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";
import { useDrawerStatus } from "@react-navigation/drawer";

export default DrawerMenu = ({ navigation }) => {

	const [isLoading, setIsLoading] = useState(false);
	const [cat, setCat] = useState();
	const [subCat, setSubCat] = useState();
	const [categoriesList, setCategoriesList] = useState([]);
	const dispatch = useDispatch();
	const authData = useSelector((state) => state.auth);
	const countryData = useSelector((state) => state.country);
	const profileImage = authData.data?.profile_image;
	const wasDrawerOpen = useDrawerStatus();
	const { width, height } = Dimensions.get('window');

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
		if (item.url == '') {
			return '';
		}
		navigation.closeDrawer();

		if (item.url_type !== "static" && item.url_type !== "product" && item?.url !== "/") {
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
		}
		setCat('');
		setSubCat('');
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>

				<View style={style.closeDrawerContainer}>
					<TouchableOpacity hitSlop={style.closeDrawerHitSlop} onPress={() => { navigation.closeDrawer() }} >
						<Icon source={ImagePath.Home.crossPink} style={style.icon} />
					</TouchableOpacity>
				</View>

				<View style={style.welcomemsg}>
					<TouchableOpacity onPress={() => { navigation.navigate('AccountStack', { screen: 'MyProfile', params: { 'flow': 'Drawer', } }) }}
						style={style.profileIcon} activeOpacity={0.7} hitSlop={style.hitSlop}>

						<FastImage
							style={{
								width: 60,
								height: 60,
								borderRadius: 100,
							}}
							source={authData.data?.slug ? (profileImage == undefined || profileImage === "") ? ImagePath.Other.emptyUser : {
								uri: profileImage,
								priority: FastImage.priority.high,
								cache: FastImage.cacheControl.immutable
							} : ImagePath.Other.emptyUser}
							resizeMode={FastImage.resizeMode.cover}
							onError={(e) => { }}
						/>
					</TouchableOpacity>

					<View style={style.welcomemsgRight}>
						<TouchableOpacity onPress={() => navigation.navigate('AccountStack', { screen: 'MyProfile' })} activeOpacity={0.7} hitSlop={style.hitSlop}>
							<Label style={style.useName} text={authData.data?.slug ? authData.data?.full_name : "Hi Guest!"} />
						</TouchableOpacity>

						{!authData.data?.slug ? <View style={style.welcomemsgRightBottom}>
							<Button
								onPress={() => { goToNav('Login') }}
								style={style.loginSignupButton}
								labelStyle={style.loginSignupButtonLable}
								title="Login"
								primaryButton
							/>
							<Button
								onPress={() => { goToNav('SignUp') }}
								style={[style.loginSignupButton, { marginLeft: Size.xs2 }]}
								labelStyle={style.loginSignupButtonLable}
								title="Signup"
								primaryButton
							/>
						</View>
							:
							<Button
								onPress={() => { logOut() }}
								style={[style.loginSignupButton, { marginTop: 10 }]}
								labelStyle={style.loginSignupButtonLable}
								title="Logout"
								primaryButton
							/>
						}
					</View>
				</View>

				<Spacer style={style.spacerTop} />

				{isLoading ?
					<View style={{ height: height / 1.6 }}>
						<Loader />
					</View> :
					<FlatList
						data={categoriesList}
						scrollEnabled={false}
						renderItem={({ item, index }) => {
							if (item.status == 1 && item.is_deleted == 0 && item.menu_type == "text" && categoriesList?.length > 0) {
								return (
									<View key={item._id}>
										<RowColumn
											onClick={() => {
												setCat(item._id);
												setSubCat('');
												item.child_menu.length == 0 ? gotoScreen(item.menu_url) : '';
											}}
											touchableStyle={[
												style.dropdownContainer, {
													backgroundColor: (item._id === cat && subCat == '') ? Colors.Concord : 'white',
												},
											]}
											style={[style.shapeIcon, { tintColor: item.child_menu.length > 0 ? item._id === cat ? Colors.Black : Colors.Black : (item._id === cat && subCat == '') ? Colors.Concord : Colors.White }]}
											label={filterName(item?.menu_mobile_name)}
											labelStyle2={style.label}
											Image={item.child_menu.length > 0 ? item._id === cat ? ImagePath.Home.openShape : ImagePath.Home.shape : ImagePath.Other.blankImage}
										/>
										{item._id === cat && item.child_menu.length > 0 && item.child_menu.map((sub) => (
											sub.menu_type == "text" &&
											<View key={sub._id}>
												<RowColumn
													onClick={() => {
														sub.child_menu?.length == 0 ? gotoScreen(sub.menu_url) : setSubCat(sub._id);
													}}
													touchableStyle={[
														style.dropdownContainer, {
															backgroundColor: sub._id === subCat && sub.child_menu.length > 0 ? Colors.Concord : 'white',
														}
													]}
													style={style.shapeIcon}
													label={filterName(sub.menu_mobile_name)}
													labelStyle2={[style.label, { paddingLeft: "6%" }]}
													Image={sub.child_menu.length > 0 ? sub._id === subCat ? ImagePath.Home.openShape : ImagePath.Home.shape : ImagePath.Other.blankImage}

												/>
												{sub._id === subCat && sub.child_menu.length > 0 && sub.child_menu?.map((subItem) => (
													subItem.menu_type == "text" &&
													<View key={subItem._id}>

														<RowColumn

															onClick={() => { gotoScreen(subItem?.menu_url) }}
															touchableStyle={[
																style.dropdownContainer, {
																	flexDirection: 'row',
																	backgroundColor: 'white',
																	paddingLeft: '10%'
																}
															]}
															label={filterName(subItem.menu_mobile_name)}
															style={style.shapeIcon}
															labelStyle2={[style.label]}
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

				<View style={style.otherLink}>
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
				</View>
			</ScrollView>
		</SafeAreaView>
	)
};

const style = StyleSheet.create({
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
		width: Size.x66 + 5,
		height: Size.x5l,
		backgroundColor: null,
		borderWidth: 1,
		borderColor: Colors.Secondary.Black,
	},
	profileIcon: {
		alignItems: 'flex-start',
		marginLeft: Size.m011,
		borderRadius: Size.x100,
		borderColor: Colors.Secondary.Black,
		borderWidth: 3
	},
	welcomemsg: {
		flexDirection: 'row',
		alignItems: 'center'
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
		width: Size.m1,
		height: Size.m1,
	},
	useName: {
		fontFamily: Typography.LatoBold,
		fontSize: 16
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
		borderTopWidth: 1,
		borderColor: Colors.Silver,
		paddingVertical: Size.l
	},
	shapeIcon: {
		width: Size.m0,
		height: Size.m0,
		top: 1,
		marginRight: Size.m11,
	},
	label: {
		fontSize: 16,
		marginLeft: Size.xl
	},
});