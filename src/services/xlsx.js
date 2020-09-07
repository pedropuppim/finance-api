const excel = require('node-excel-export');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

module.exports = app => {

    const getXlsx = async (fields, dataset) => {

        try {
            const styles = {
                header: {
                    font: {
                        bold: true,
                    }
                },
            };

            var spec = '';
            var specs = {};
            function getFields(element) {

                spec = {
                    [element[0]]: {
                        displayName: element[1],
                        headerStyle: styles.header,
                        width: element[2]
                    }
                }
                Object.assign(specs, spec);

            }

            fields.forEach(getFields);


            const report = excel.buildExport(
                [
                    {
                        name: 'Report',
                        specification: specs,
                        data: dataset
                    }
                ]
            );

            const name_file = uuidv4() + '.xlsx';
            const dir = __dirname + "/../../public/";

            fs.writeFileSync(dir + name_file, report);

            return name_file;


        } catch (error) {
            console.log(error);
        }        

    }

    return { getXlsx };

}
