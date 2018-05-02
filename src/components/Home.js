import React, { Component } from "react";
import { Header } from "./Header";

export default class Home extends Component {
  componentDidMount() {
    document.title = "Home";
  }
  render() {
    return <Header iconName="jam jam-home" headerText="Home" />;
  }
}
