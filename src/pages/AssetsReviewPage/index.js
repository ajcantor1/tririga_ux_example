import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import {
    DataTable,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
} from "carbon-components-react";
import { BuildingsServices } from "../../services";
import { Button, DatePicker, DatePickerInput, ComposedModal, Dropdown } from "carbon-components-react";

const AssetsReviewPage = () => {


    const { id } = useParams();
    const [assetReviews, setAssetReviews] = useState([]);
    const [assetReviewCodes, setAssetReviewCodes] = useState([]);
    const [selectedReviewCode, setSelectedReviewCode] = useState('')
    const [selectedDate, setSelectedDate] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const headers = [
        {
            key: "id",
            header: "id",
        },
        {
            key: "assetReviewTypeCode",
            header: "Asset Review Type Code",
        },

        {
            key: "assetReviewDate",
            header: "Asset Review Date",
        },
    ];

    useEffect(() => {
        (async () => {
            let assetReviewCodes = await BuildingsServices.getAssetReviewTypeCodes();
            assetReviewCodes.forEach((item) => {
                item.id = item._id;
            });
            console.log(assetReviewCodes)
            setAssetReviewCodes(assetReviewCodes);
            await loadAsssetReviews(id)

        })();
    }, [id]);

    const loadAsssetReviews = async (id) => {
        let _assetReviewsByBuildingId = await BuildingsServices.getAssetReviewsByBuildingId(id);
        let rpimIds = _assetReviewsByBuildingId.map((assetReviewById) => {
            return assetReviewById.rpimId;
        });
        console.log(rpimIds);
        let _assetReviews = await BuildingsServices.getAssetReviews(rpimIds)
        console.log(_assetReviews);
        setAssetReviews(_assetReviews);
    }
    const addAssetReview = async (event) => {
        console.log(selectedDate)
        console.log(selectedReviewCode)
        await BuildingsServices.addAssetReviews({
            assetReviewTypeCode: selectedReviewCode,
            assetReviewDate: selectedDate
        });
        setOpenModal(false);
    }


    return (
        <div>
            <ComposedModal open={openModal} onClose={() => setOpenModal(false)}>
                <Dropdown
                    ariaLabel="Dropdown"
                    id="carbon-dropdown-example"
                    items={assetReviewCodes}
                    itemToString={(item) => item.name}
                    label="Asset Review Codes"
                    onChange={({ event }) => setSelectedReviewCode(event.currentTarget.value)}
                    value={selectedReviewCode}
                />
                <DatePicker dateFormat="m/d/Y" datePickerType="single">
                    <DatePickerInput
                        id="date-picker-default-id"
                        placeholder="mm/dd/yyyy"
                        labelText="Date picker label"
                        type="text"
                        onChange={({ event }) => setSelectedDate(event.currentTarget.value)}
                        value={selectedDate}
                    />
                </DatePicker>
                <Button onClick={addAssetReview} />
            </ComposedModal>

            <DataTable rows={assetReviews} headers={headers}>
                {({
                    rows,
                    headers,
                    getHeaderProps,
                    getRowProps,
                    getTableProps,
                    getTableContainerProps,
                }) => (
                    <TableContainer
                        title="Assets Review"
                        description="Assets Review Description"
                        {...getTableContainerProps()}
                    >
                        <Table {...getTableProps()} isSortable>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader
                                            key={header.key}
                                            {...getHeaderProps({ header })}
                                            isSortable
                                        >
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.id} {...getRowProps({ row })}>
                                        {row.cells.map((cell) => {

                                            return (<TableCell key={cell.id}>{cell.value}</TableCell>)
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DataTable>
            <Button onClick={() => setOpenModal(true)} />
        </div>
    );
}
export default AssetsReviewPage;