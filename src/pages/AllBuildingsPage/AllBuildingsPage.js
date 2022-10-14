import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { Routes, AppMsg } from "../../utils";
import { FooterButtons } from "../../components";
import { BuildingsServices } from "../../services";
import SearchBox from "../../components/SearchBox";

const cssBase = "allBuildingsPage";

const AllBuildingsPage = () => {

    useEffect(() => { }, []);

    const headers = [
        {
            key: "building",
            header: AppMsg.getMessage(AppMsg.MESSAGES.NAME),
        },
        {
            key: "parentProperty",
            header: AppMsg.getMessage(AppMsg.MESSAGES.PARENT_PROPERTY),
        },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [buildings, setBuildings] = useState([]);

    const onSearchTermChange = async (event) => {
        setSearchTerm(event.target.value);
    }

    const loadBuildingById = async () => {
        const buildings = await BuildingsServices.getBuildingsById(searchTerm);
        await (async () => {
            buildings.forEach((item) => {
                item.id = item._id;
            });
        })();

        setBuildings(buildings);
    };

    return (
        <div className={cssBase}>
            <SearchBox onSearch={loadBuildingById} searchTerm={searchTerm} onSearchTermChange={onSearchTermChange} />
            <div className={`${cssBase}__content`}>
                <DataTable rows={buildings} headers={headers}>
                    {({
                        rows,
                        headers,
                        getHeaderProps,
                        getRowProps,
                        getTableProps,
                        getTableContainerProps,
                    }) => (
                        <TableContainer
                            title={AppMsg.getMessage(AppMsg.MESSAGES.BUILDINGS)}
                            description={AppMsg.getMessage(
                                AppMsg.MESSAGES.ALL_BUILDINGS_DESCRIPTION
                            )}
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
                                            {row.cells.map((cell, index) => {
                                                if (index == 0) {
                                                    return (<TableCell key={cell.id}><Link to={`/assetsreview/${cell.value}`}>{cell.value}</Link></TableCell>)
                                                }
                                                return (<TableCell key={cell.id}>{cell.value}</TableCell>)
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DataTable>
            </div>
            <FooterButtons
                secondaryLabel={AppMsg.getMessage(AppMsg.BUTTONS.HOME)}
                secondaryRoute={Routes.HOME}
            />
        </div>
    );
}
export default AllBuildingsPage;
