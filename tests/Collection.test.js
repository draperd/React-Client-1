/* global it, jest */

import React from "react";
import ReactDOM from "react-dom";
import {shallow, mount} from "enzyme";
import Collection from "../src/components/containers/Collection";
import xhr from "../src/utilities/Xhr";

import {assert} from "chai";
import {sandbox, spy} from "sinon";
import axios from "axios";

jest.mock("./mocks/nodes.js");

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Collection />, div);
});

it("calls getData", () => {
   const componentDidMountSpy = spy(Collection.prototype, "setState");
   const wrapper = mount(<Collection />);
   assert.equal(Collection.prototype.setState.callCount, 0);
   componentDidMountSpy.restore();
});

it("makes xhr request with correct defaults", () => {
   const xhrSpy = spy(xhr, "get");
   const collection = shallow(
      <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children" />
   );
   assert.equal(xhr.get.getCall(0).args[0], "/api/-default-/public/alfresco/versions/1/nodes/-root-/children?relativePath=/&skipCount=0&maxItems=10");
   xhrSpy.restore();
});

it("makes xhr request configured maxItems", () => {
   const xhrSpy = spy(xhr, "get");
   const collection = shallow(
      <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children"
                  maxItems={5} />
   );
   assert.equal(xhr.get.getCall(0).args[0], "/api/-default-/public/alfresco/versions/1/nodes/-root-/children?relativePath=/&skipCount=0&maxItems=5");
   xhrSpy.restore();
});

it("updates state as expected", () => {
   let sb = sandbox.create();
   const data = { 
      data: {
         list: {
            entries: [1,2,3]
         }
      }
   }
   const resolved = new Promise((r) => r({ data }));
   sb.stub(axios, "get").returns(resolved);

   const collection = shallow(
      <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children"/>
   );
   assert.equal(collection.state().list.entries.length, 5);

   sb.restore()
});
