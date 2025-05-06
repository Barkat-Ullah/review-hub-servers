
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminService } from "./admin.service";


 const getDashboardOverview = catchAsync(async (req, res) => {
    const result = await adminService.getDashboardOverviewFromDb();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Dashboard overview data fetched successfully",
        data: result,
    });
 });

 const getPopularPremiumReviews = catchAsync(async (req, res) => {
    const result = await adminService.getPopularPremiumReviewsFromDb();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Popular premium reviews data fetched successfully",
        data: result,
    });
 });

 export const adminController = {
        getDashboardOverview,
        getPopularPremiumReviews
 }