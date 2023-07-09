import React from "react";
import GridOverview from "../../components/GridOverview/GridOverview";
import Searchbar from "../../components/Searchbar/Searchbar";

const Main = () => {
    return (
        <div>
            <div className="p-2">
                <Searchbar />
                <GridOverview />
            </div>
        </div>
    );
};

export default Main;