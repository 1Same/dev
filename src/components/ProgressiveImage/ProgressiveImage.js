// import React from "react";
// import { Animated, StyleSheet, View, Image } from "react-native";
// import { ImagePath } from "../../constants";

// class ProgressiveImage extends React.Component {
//     constructor(props) {
//         super(props);
//         this.imageAnimated = new Animated.Value(0); // Main image starts hidden
//     }

//     handleImageLoad = () => {
//         Animated.timing(this.imageAnimated, {
//             toValue: 1, // Fade in the main image
//             duration: 200, // Faster transition
//             useNativeDriver: true,
//         }).start();
//     };

//     render() {
//         const { defaultImageSource, source, style, resizeMode, AllData, ...props } = this.props;
//         return (
//             <View style={[styles.container, style]}>
//                 {/* Placeholder Image (static) */}
//                 <Image
//                     source={defaultImageSource || ImagePath.Other.blankImageproductFlora}
//                     style={[styles.image, style]}
//                     resizeMode={resizeMode || "cover"}
//                     blurRadius={5} // Adds a blur effect to placeholder
//                 />

//                 {/* Final Image with Animation */}
//                 <Animated.Image
//                     {...props}
//                     source={source}
//                     style={[
//                         styles.image,
//                         style,
//                         { opacity: this.imageAnimated }, // Fade effect
//                     ]}
//                     resizeMode={resizeMode || "cover"}
//                     onLoad={this.handleImageLoad}
//                 />

//                 {/* Optional Content */}
//                 {AllData && <View>{AllData}</View>}
//             </View>
//         );
//     }
// }

// export default ProgressiveImage;

// const styles = StyleSheet.create({
//     container: {
//         position: "relative",
//     },
//     image: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         width: "100%",
//         height: "100%",
//     },
// });

import React from "react";
import { Animated, StyleSheet, View } from 'react-native';
import { ImagePath } from "../../constants";

class ProgressiveImage extends React.Component {
    defaultImageAnimated = new Animated.Value(0);
    imageAnimated = new Animated.Value(0);


    handleDefaultImageLoad = () => {
        Animated.timing(this.defaultImageAnimated, {
            toValue: 1,
            useNativeDriver: true
        }).start();
    }

    handleImageLoad = () => {
        Animated.timing(this.imageAnimated, {
            toValue: 1,
            useNativeDriver: true
        }).start();
    }

    render() {
        const { defaultImageSource, source, AllData, style, ...props } = this.props;
        return (
            <View style={styles.container}>
                <Animated.Image
                    {...props}

                    source={defaultImageSource ? defaultImageSource : ImagePath.Other.blankImageproductFlora}
                    // style={[style, { opacity: this.defaultImageAnimated }]}
                    style={[style, { opacity: 0.2 }]}
                    onLoad={this.handleDefaultImageLoad}
                    blurRadius={1}
                />
                <Animated.Image
                    {...props}
                    source={source} style={[style, { opacity: this.imageAnimated }, styles.imageOverlay]}
                    onLoad={this.handleImageLoad}
                />
                {AllData && <View>{AllData}</View>}

            </View>
        )
    }

}
export default ProgressiveImage;

const styles = StyleSheet.create({
    container: {
        // backgroundColor: Colors.White
    },
    imageOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }
})