import { getAppModel } from "../AppModel";
import { DatasourceNames } from "../../utils";

export async function getAllBuildings() {
    const response = await getAppModel().getRecord(
        DatasourceNames.BUILDINGS_DS_NAME
    );
    return response.data;
}

export async function getAssetReviewTypeCodes() {
    const response = await getAppModel().getRecord(
        DatasourceNames.ASSET_REVIEW_TYPE_CODE_DS_NAME
    );
    return response.data;
}

export async function getBuildingsById(id) {
    const response = await getAppModel().getRecord(
        DatasourceNames.BUILDINGS_DS_NAME,
        {
            filters: [
                { name: "building", operator: "contains", value: id },
            ]
        }
    );
    return response.data;
}

export async function getAssetReviewsByBuildingId(id) {
    const response = await getAppModel().getRecord(
        DatasourceNames.ASSET_REVIEW_BUILDING_ID_DS_NAME,
        {
            filters: [
                { name: "building", operator: "equals", value: id },
            ]
        }
    );
    return response.data;
}

export async function getAssetReviews(ids) {
    let filters = []
    ids.forEach((id, idx) => {
        filters.push({ name: "id", operator: "equals", value: id });
        if (idx < ids.length - 1) {
            filters.push({ operator: "or" });
        }
    });
    const response = await getAppModel().getRecord(
        DatasourceNames.ASSET_REVIEW_DS_NAME,
        {
            filters: filters
        }
    );
    return response.data;
}

export async function addAssetReview(assetReview) {
    const response = await getAppModel().addRecord(DatasourceNames.ASSET_REVIEW_DS_NAME, assetReview);
    return response.data;
}