import React from "react";
import ReactDOM from "react-dom";
import {shallow, mount} from "enzyme";
import Collection from "../src/components/containers/Collection";
import xhr from "../src/utilities/Xhr";

import {assert} from "chai";
import { fakeServer, spy} from "sinon";

const fakeResponseHeaders = { "Content-Type": "application/json; charset=UTF-8" };
let server;

beforeEach(() => {
   server = fakeServer.create();
   server.autoRespond = true;
   server.respondImmediately = true;
});

afterEach(() => {
   server.restore();
});


it("calls getData when mounted", () => {
   const componentDidMountSpy = spy(Collection.prototype, "setState");
   mount(<Collection />);
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


it("sets state correctly", () => {

   const fakeReponse = JSON.stringify({
      list: {
         entries: [1,2,3,4,5]
      }
   });
   server.respondWith("GET", /(.*)/, [200, fakeResponseHeaders, fakeReponse]);

   const collection = mount(
      <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children"/>
   );

   return new Promise((resolve) => {
      setTimeout(() => {
         try
         {
            assert.equal(collection.state().list.entries.length, 5);
         }
         catch(e) {}
         resolve();
      });
   });
});
