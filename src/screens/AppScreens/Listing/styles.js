import { Dimensions, Platform, StyleSheet } from "react-native";
import { Size, Colors, Typography } from "../../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from "react-native-responsive-screen";

const { height, width } = Dimensions.get("window");

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  oderTitle: {
    fontSize: 17,
    fontFamily: Typography.LatoBold,
  },
  manView: {
    paddingHorizontal: wp("4%"),
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterContainer: {
    position: "absolute",
    bottom: height * 0.1,
    right: 15,
  },
  filterIcon: {
    height: 58,
    width: 58,
  },
  offerIconContainer: {
    position: "absolute",
    marginLeft: wp("3.1%"),
    top: 0,
    width: "93.7%",
    flexDirection: "row",
  },
  offerFlowerIcon: {
    width: 35,
    height: 35,
  },
  offerIcon: {
    width: 95,
    height: 23,
  },
  heartIconCon: {
    width: 36,
    height: 36,
    borderRadius: 100,
    backgroundColor: Colors.White,
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    elevation: 4,
    zIndex: 2,
  },
  heartIcon: {
    width: 19,
    height: 17,
  },
  flowersContainer: {
    borderWidth: 1,
    backgroundColor: Colors.White,
    borderColor: Colors.Mischka,
    borderRadius: 16,
    width: wp("45.4%"),
    height: wp("70%"),
    marginLeft: wp("3.1%"),
  },
  flowerIcon: {
    borderRadius: 5,
    width: wp("41.5%"),
    height: wp("40.8%"),
  },
  bannerFlowerIcon: {
    height: wp("70.3%"),
    width: wp("44.8%"),
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  regularText: {
    fontSize: 14,
    color: Colors.Dune,
    fontFamily: Typography.poppinsMedium,
    color: Colors.DoveGrayNew,
  },
  boldText: {
    fontSize: 13.5,
    color: Colors.Black,
    fontFamily: Typography.poppinsSemiBold,
  },
  buyNowTitle: {
    fontSize: 12,
    fontFamily: Typography.LatoMedium,
  },
  disCountBoder: {
    bottom: Platform.OS == "ios" ? 10 : 14,
    borderWidth: 0.8,
  },
  rowColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  hitSlop: {
    top: Size.xm,
    bottom: Size.xm,
    left: Size.xm,
    right: Size.xm,
  },
  deliveryLabel: {
    fontSize: 11,
    color: Colors.Black,
  },
  wishlistLoader: {
    backgroundColor: null,
    padding: 0,
    borderRadius: 0,
    elevation: 0,
  },
  productRatingCon: {
    width: "98.3%",
    justifyContent: "space-between",
  },
  ratingIcon: {
    width: 13,
    height: 13,
  },
  shortingPopup: {
    backgroundColor: Colors.White,
    width: "50%",
    height: "15%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  shortContainer: {
    marginVertical: 7,
    flexDirection: "row",
    alignItems: "center",
  },
  currency_symbolView: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingMainContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: "100%",
    width: "100%",
    position: "absolute"
  },
});
