import React from "react";
import ReactDOM from "react-dom";
import {shallow, mount} from "enzyme";
import Collection from "../src/components/containers/Collection";
import { collectionEvents } from "../src/components/containers/Collection";
import xhr from "../src/utilities/Xhr";

import {assert} from "chai";
import { fakeServer, match, spy} from "sinon";
import { merge, clone } from "lodash";

import EventButton from "./components/EventButton";


const fakeResponseHeaders = { "Content-Type": "application/json; charset=UTF-8" };
const fakeReponseTemplate = {
   list: {
      entries: [1,2,3,4,5,6,7,8,9,10],
      pagination: {
         count: 10,
         hasMoreItems: true,
         skipCount: 0,
         totalItems: 100
      }
   }
};

let server, xhrSpy;

beforeEach(() => {
   xhrSpy = spy(xhr, "get");
   server = fakeServer.create();
   server.autoRespond = true;
   server.respondImmediately = true;
});

afterEach(() => {
   server.restore();
   xhrSpy.restore();
});


it("calls getData when mounted", () => {
   const componentDidMountSpy = spy(Collection.prototype, "setState");
   mount(<Collection />);
   assert.equal(Collection.prototype.setState.callCount, 0);
   componentDidMountSpy.restore();
});

it("makes xhr request with correct defaults", () => {
   const collection = shallow(
      <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children" />
   );
   assert.equal(xhr.get.getCall(0).args[0], "/api/-default-/public/alfresco/versions/1/nodes/-root-/children?relativePath=/&skipCount=0&maxItems=10");
   
});

it("makes xhr request configured maxItems", () => {
   const collection = shallow(
      <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children"
                  maxItems={5} />
   );
   assert.equal(xhr.get.getCall(0).args[0], "/api/-default-/public/alfresco/versions/1/nodes/-root-/children?relativePath=/&skipCount=0&maxItems=5");
});


it("sets state correctly", () => {

   const fakeReponse = JSON.stringify(fakeReponseTemplate);
   server.respondWith("GET", /(.*)/, [200, fakeResponseHeaders, fakeReponse]);

   const collection = mount(
      <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children"/>
   );

   return new Promise((resolve, reject) => {
      setTimeout(() => {
         try
         {
            assert.equal(collection.state().list.entries.length, 10);
            resolve();
         }
         catch(e) {
            reject(e);
         }
         
      });
   });
});

it ("handles page forwards", () => {
   const fakeReponse = JSON.stringify(fakeReponseTemplate);
   server.respondWith("GET", /(.*)/, [200, fakeResponseHeaders, fakeReponse]);

   // Mount the collection with a button to emit the page forward event...
   const collection = mount(
      <Collection url="/api/-default-/public/alfresco/versions/1/nodes/-root-/children">
         <EventButton eventName={collectionEvents.PAGE_FORWARDS} />
      </Collection>
   );

   return new Promise((resolve, reject) => {
      setTimeout(() => {
         try
         {
            // First call should not skip any items...
            assert.include(xhr.get.firstCall.args[0], "&skipCount=0");

            // Click the button to request the next page...
            collection.find("button").simulate("click");

            // A second call should skip 10 items...
            assert.include(xhr.get.secondCall.args[0], "&skipCount=10");
            resolve();
         }
         catch(e)
         {
            // Failed assertions will throw an exception, we need to reject the promise
            // passing the exception as the reason...
            reject(e);
         }
      });
   });
})
