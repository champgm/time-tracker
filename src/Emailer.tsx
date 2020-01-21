import _ from "lodash";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  TextInput,
  TextStyle,
  ToastAndroid,
  View,
} from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import v4 from "uuid/v4";

import { createBasesFromColor, rgb, rgbStrings as bases } from "solarizer";
import { configuration } from "./Configuration";
import { addRow } from "./google/Google";

const blue = createBasesFromColor(rgb.blue, "base01");
const red = createBasesFromColor(rgb.red, "base01");
const green = createBasesFromColor(rgb.green, "base01");

export interface Props { }

interface State {
  note?: string;
  sending?: boolean;
}

export class Emailer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  resetState() {
    this.setState({
      note: undefined,
      sending: undefined,
    });
  }

  async markTime(action: string) {
    this.setState({ sending: true });
    try {
      ToastAndroid.showWithGravity(
        "Updating sheet...",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } catch (error) {
      // console.log(`Could not show sending toast.`);
    }
    try {
      await addRow(new Date(), action, this.state.note)
    } catch (error) {
      try {
        console.log(`${JSON.stringify(error, null, 2)}`);
        ToastAndroid.showWithGravity(
          JSON.stringify(error, null, 2),
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      } catch (error) {
        console.log(`Could not show error toast, error: ${error}`);
        console.log(`Errors: ${error}`);
      }
      return
    }

    try {
      ToastAndroid.showWithGravity(
        "Successfully updated sheet",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } catch (error) {
      console.log(`Could not show success toast: ${error}`);
    }
    this.resetState();
  }

  render() {
    return (
      <View style={styles.root} >
        <View style={styles.form} >
          <View>
            <TextInput
              // Note Field
              multiline={true}
              numberOfLines={8}
              onChangeText={(note) => this.setState({ note })}
              style={styles.note}
              value={this.state.note}
              testID="6b50a3ac-a102-4150-823c-e20d44f0c84d"
            />
          </View>
          <View style={styles.actionButtonGroup}>
            <AwesomeButton
              // Stop button
              key={v4()}
              onPress={() => this.markTime('STOP')}
              accessibilityLabel="Stop"
              width={width / 3}
              backgroundColor={this.state.sending ? bases.base01 : red.base01}
              backgroundActive={this.state.sending ? bases.base02 : red.base02}
              backgroundDarker={this.state.sending ? bases.base03 : red.base03}
              disabled={this.state.sending}
            >
              Stop
            </AwesomeButton>
            <AwesomeButton
              // Submit Button
              key={v4()}
              onPress={() => this.markTime('START')}
              accessibilityLabel="Start"
              testID="2d8395f6-03a5-4c61-9c3b-595143aec8bf"
              width={width / 3}
              backgroundColor={this.state.sending ? bases.base01 : green.base01}
              backgroundActive={this.state.sending ? bases.base02 : green.base02}
              backgroundDarker={this.state.sending ? bases.base03 : green.base03}
              disabled={this.state.sending}
            >
              Start
            </AwesomeButton>
          </View>
        </View>
      </View >);
  }
}

const width = Dimensions.get("window").width * .7;
const marginTop = Dimensions.get("window").height * .03;
const textInputBorder: TextStyle = {
  borderColor: bases.base01,
  borderRadius: 5,
  borderWidth: 1,
};
const styles = StyleSheet.create({
  actionButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop,
    width,
  },
  note: {
    paddingHorizontal: Dimensions.get("window").width * .01,
    paddingVertical: Dimensions.get("window").width * .01,
    backgroundColor: bases.base02,
    marginTop,
    textAlignVertical: "top",
    color: bases.base0,
    width,
  },
  form: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: bases.base03,
    flex: 1,
    justifyContent: "flex-start",
    marginTop: Dimensions.get("window").height * .1,
  },
  root: {
    backgroundColor: bases.base03,
    flex: 1,
  },
});
