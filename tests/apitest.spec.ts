import { test, expect, APIResponse } from "@playwright/test";
import postRequest from "../test-data/api-requests/post_request_body.json";
import tokenRequest from "../test-data/api-requests/token_request_body.json";
import { z } from 'zod';
import _ from "lodash";


/*

These are interfaces which we have created
these interfaces can be replaced using zod 
library. cody duplicacy will be avoided.

interface BookingDates {
    checkin: string;
    checkout: string;
}

interface Booking {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds: string;
}

interface PostAPIResponse {
    bookingid: number;
    booking: Booking;
}
*/


const BookingDatesSchema = z.object({
    checkin: z.string(),
    checkout: z.string(),
});

const BookingSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    totalprice: z.number(),
    depositpaid: z.boolean(),
    bookingdates: BookingDatesSchema,
    additionalneeds: z.string(),
});

const PostAPIResponseSchema = z.object({
    bookingid: z.number(),
    booking: BookingSchema,
});

type postApiResponseType = z.infer<typeof PostAPIResponseSchema>;

/*
const stringArraySchema = z.array(z.string());
type stringArrType = z.infer<typeof stringArraySchema>;
*/

test.use({
    baseURL: process.env.API_BASE_URI,
});

test("End to End API testing using playwright", async ({ request }) => {

    let tokenNo: number;
    let bId: number;

    // https://restful-booker.herokuapp.com/booking
    /* 
        This is post request
        data is coming from json file located at
        test-data/api-requests/post_reuest_body.json
    */


    /*

    This test step is written using
    async await

    await test.step('Create booking', async () => {
        const postAPIResponse = await request.post("/booking", {
            data: postRequest,
        })
        const bookingId = await postAPIResponse.json();
        bId = bookingId.bookingid;
    });

    */



    /*
        This test step is written using
        then promise instead of async await syntax
    */
    await test.step('Create booking', () => {
        request.post("/booking", {
            data: postRequest,
        }).then(function (postAPIResponse: APIResponse) {

            postAPIResponse.json().then(function (bookingInfoResp: postApiResponseType) {
                // validating json schema of the response received
                PostAPIResponseSchema.parse(bookingInfoResp);

                // printing response to console
                const jsonPretty = JSON.stringify(bookingInfoResp, null, 2);
                console.log("this is response of create booking");
                console.log(jsonPretty);

                // expecting response to not to be null or empty
                expect(bId).not.toBeNull();
                bId = bookingInfoResp.bookingid;

                /* expecting the data sent while making a post req
                   is same as when post req was made
                */
                expect(bookingInfoResp.booking).toEqual(postRequest);
            });
        });
    });

    await test.step('Validating if newly generated id is getting stored on server', async () => {
        const BookingIdSearchAPiResponse = await request.get("/booking", {});
        const responseData = await BookingIdSearchAPiResponse.json();

        const jsonPretty = JSON.stringify(responseData, null, 2);
        console.log("this is response of search booking id");
        console.log(jsonPretty);

        const mapOfIds: number[] = responseData.map((resp: { bookingid: number; }) => {
            return resp.bookingid;
        });

        console.log(bId);
        console.log(mapOfIds);
        expect(mapOfIds).toContain(bId);

    });

    await test.step('Get booking details', async () => {
        const getAPIResponse = await request.get("/booking/", {
            params: {
                firstname: "harish raut playwright",
                lastname: "harish raut api testing",
            },
        });

        const jsonPretty = JSON.stringify(getAPIResponse, null, 2);
        console.log("this is response of get booking details");
        console.log(jsonPretty);

        //console.log(await getAPIResponse.json());
        expect(getAPIResponse.ok()).toBeTruthy();
        expect(getAPIResponse.status()).toBe(200);
    });

    await test.step('Generate token & Validate status code', async () => {
        const tokenAPIResponse: APIResponse | void = await request.post("/auth", {
            data: tokenRequest,
        });

        const jsonPretty = JSON.stringify(tokenAPIResponse, null, 2);
        console.log("this is response of generate token and validate status code");
        console.log(jsonPretty);

        expect(tokenAPIResponse.ok()).toBeTruthy();
        expect(tokenAPIResponse.status()).toBe(200);
        console.log(await tokenAPIResponse.json());
        const tokenResponseBody = await tokenAPIResponse.json();
        tokenNo = tokenResponseBody.token;
    });

    await test.step('Partial update booking details & Validate status code', async () => {
        const patchAPIResponse = await request.patch(`/booking/${bId}`, {
            headers: {
                "Content-Type": "application/json",
                Cookie: `token=${tokenNo}`,
            },
            data: {
                firstname: "harish raut postman",
                lastname: "harish rest assured",
            },
        });


        const jsonPretty = JSON.stringify(patchAPIResponse, null, 2);
        console.log("this is response of patch api response");
        console.log(jsonPretty);

        expect(patchAPIResponse.ok()).toBeTruthy();
        expect(patchAPIResponse.status()).toBe(200);
    });

    await test.step('Delete booking & Validate status code', async () => {
        const deleteAPIResponse = await request.delete(`/booking/${bId}`, {
            headers: {
                "Content-Type": "application/json",
                "Cookie": `token=${tokenNo}`,
            },
        });

        const jsonPretty = JSON.stringify(deleteAPIResponse, null, 2);
        console.log("this is response of delete api response");
        console.log(jsonPretty);

        expect(deleteAPIResponse.status()).toBe(201);
        expect(deleteAPIResponse.statusText()).toBe("Created");
    });

    /*
  schema validation example using zod
  
  await test.step('temp', async () => {
      const arr: stringArrType = ["1", "2", "3"];
      try {
          stringArraySchema.parse(arr);
          expect(arr).toEqual(["1", "2"]);
      } catch (error) {
          console.log(error);
      }
  })
  */
});