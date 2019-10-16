import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import Router from "./router";
import store from "@store/index";
import Scrollbars from "react-custom-scrollbars";
import PubSub from "@common/utils/pubsub";
import "@common/utils/dom";

(window as any).store = store;

let scrollBar: Scrollbars = null;
PubSub.subscribe("scrollto", (top: number) => {
  const fn = () => {
    scrollBar.scrollTop(top);
  };
  setTimeout(fn, 200);
});

ReactDOM.render(
  <Scrollbars ref={dom => (scrollBar = dom)} autoHide>
    <Provider store={store}>
      <Router />
    </Provider>
  </Scrollbars>,
  document.body
);
