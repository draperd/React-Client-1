import React from "react";
import ReactDOM from "react-dom";
import {shallow, mount} from "enzyme";

import Property from "../src/components/renderers/Property";
import { collectionEvents } from "../src/components/containers/Collection";
import { assert } from "chai";

import EventCatcher from "./components/EventCatcher";
import item from "./data/SampleNode";

it ("renders name correctly", () => {
   const property = mount(
      <Property item={item} property="name" />
   );
   assert.equal(property.text(), "Bob");
});


it ("renders date correctly", () => {
   const property = mount(
      <Property item={item} property="createdAt" renderAs="DATE" />
   );
   assert.equal(property.text(), "Friday, February 10, 2017");
});


it ("does NOT emit navigate event on click unless navigation is configured to true", () => {
   const eventCatcher = mount(
      <EventCatcher events={ [ collectionEvents.NAVIGATE ] }>
         <Property item={item} property="name" />
      </EventCatcher>);

   eventCatcher.find("span").simulate("click");

   let state = eventCatcher.state();
   assert.notProperty(state, "lastEvent");
});


it ("emits navigate event on click", () => {
   const eventCatcher = mount(
      <EventCatcher events={ [ collectionEvents.NAVIGATE ] } >
         <Property item={item} navigation={true} property="name" />
      </EventCatcher>);

   eventCatcher.find("span").simulate("click");

   let state = eventCatcher.state();
   assert.deepPropertyVal(state, "lastEvent.detail.entry.name", "Bob");
});
