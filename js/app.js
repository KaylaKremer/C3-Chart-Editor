/****** C3 CHART EDITOR ******/

/* Configs for require.js to work with a localhost server. Must pass in d3.min.js as the first parameter in order for c3.min.js to work! */

requirejs.config({
    baseUrl: '/js'
});

requirejs(["d3.min", "c3.min"], (d3, c3) => {

    /* Plugin for Y2 Axis Visiblity */

    c3.chart.fn.axis.show_y2 = function(shown) {
        var $$ = this.internal,
            config = $$.config;
        config.axis_y2_show = !!shown;
        $$.axes.y2.style("visibility", config.axis_y2_show ? 'visible' : 'hidden');
        $$.redraw();
    };

    /* Generate Chart and Settings */

    const chart = c3.generate({
        bindto: '#chart',
        data: {
            columns: [],
            type: 'line'
        },
        labels: true,
        axis: {
            x: {
                label: {
                    text: 'X Axis Label',
                    position: 'outer-center'
                }
            },
            y: {
                label: {
                    text: 'Y Axis Label',
                    position: 'outer-middle'
                }
            },
            y2: {
                label: {
                    text: 'Y2 Axis Label',
                    position: 'outer-middle'
                },
                show: false
            }
        },
        color: {
            pattern: ['#f80c12', '#ff9933', '#ffff32', '#69d025', '#12bdb9', '#442299']
        }
    });

    /* Chart Types */

    /* Add event listeners to all chart type buttons. Transform chart type on click.*/

    function setChartTypes() {
        document.getElementById('pie').addEventListener('click', () => {
            chart.transform('pie');
        });
        document.getElementById('donut').addEventListener('click', () => {
            chart.transform('donut');
        });
        document.getElementById('bar').addEventListener('click', () => {
            chart.transform('bar');
        });
        document.getElementById('line').addEventListener('click', () => {
            chart.transform('line');
        });
        document.getElementById('area').addEventListener('click', () => {
            chart.transform('area');
        });
        document.getElementById('scatter').addEventListener('click', () => {
            chart.transform('scatter');
        });
    }

    /* Chart Titles & Axis Labels */

    /* Set defaul text for chart titles and axis labels. Add event listeners to change title and label values based on user's input. */

    function setTitlesAndLabels() {
        const chartTitle = document.getElementById('chart-title');
        chartTitle.textContent = 'Chart Title';
        const title = document.getElementById('title');
        const chartSubtitle = document.getElementById('chart-subtitle');
        chartSubtitle.textContent = 'Chart Subtitle';
        const subtitle = document.getElementById('subtitle');
        const xAxisLabel = document.getElementById('x-axis-label');
        const yAxisLabel = document.getElementById('y-axis-label');
        const y2AxisLabel = document.getElementById('y2-axis-label');
        const xColumns = document.getElementsByClassName('x-column');
        const yColumns = document.getElementsByClassName('y-column');
        const y2Columns = document.getElementsByClassName('y2-column');

        title.addEventListener('input', () => {
            chartTitle.textContent = title.value;
        });

        subtitle.addEventListener('input', () => {
            chartSubtitle.textContent = subtitle.value;
        });

        xAxisLabel.addEventListener('input', () => {
            chart.axis.labels({
                x: xAxisLabel.value,
            });
            for (let xColumn of xColumns) {
                xColumn.textContent = 'X Values';
            }
        });

        yAxisLabel.addEventListener('input', () => {
            chart.axis.labels({
                y: yAxisLabel.value,
            });
            for (let yColumn of yColumns) {
                yColumn.textContent = 'Y Values';
            }
        });

        y2AxisLabel.addEventListener('input', () => {
            chart.axis.labels({
                y2: y2AxisLabel.value,
            });
            if (y2Columns) {
                for (let y2Column of y2Columns) {
                    y2Column.textContent = 'Y2 Values';
                }
            }
        });
    }

    /* Color Themes */

    /* Create rainbow, pastel, and monochrome color themes for the chart data. Add event listeners to radio buttons and change color pattern on click. */

    function setColorThemes() {
        const rainbowTheme = document.getElementById('rainbow');
        const pastelTheme = document.getElementById('pastel');
        const monochromeTheme = document.getElementById('monochrome');

        rainbowTheme.addEventListener('click', () => {
            const colorTheme = ['#f80c12', '#ff9933', '#ffff32', '#69d025', '#12bdb9', '#442299'];
            const newColorTheme = {};
            chart.data().forEach((datum, i) => {
                newColorTheme[datum.id] = colorTheme[i];
            });
            chart.data.colors(newColorTheme);
        });

        pastelTheme.addEventListener('click', () => {
            const colorTheme = ['#fea3aa', '#f8b88b', '#faf884', '#baed91', '#b2cefe', '#f2a2e8'];
            const newColorTheme = {};
            chart.data().forEach((datum, i) => {
                newColorTheme[datum.id] = colorTheme[i];
            });
            chart.data.colors(newColorTheme);
        });

        monochromeTheme.addEventListener('click', () => {
            const colorTheme = ['#999999', '#888888', '#666666', '#555555', '#444444', '#333333'];
            const newColorTheme = {};
            chart.data().forEach((datum, i) => {
                newColorTheme[datum.id] = colorTheme[i];
            });
            chart.data.colors(newColorTheme);
        });
    }

    /* Form Buttons */

    /* Add event listeners to form buttons to perform appropriate action when user clicks on them. */

    function setFormButtons() {
        const addSeriesBtn = document.getElementById('add-series-btn');
        addSeriesBtn.addEventListener('click', addTableSeries);
        const deleteSeriesBtn = document.getElementById('delete-series-btn');
        deleteSeriesBtn.addEventListener('click', deleteTableSeries);
        const addRowAllBtn = document.getElementById('add-row-all-btn');
        addRowAllBtn.addEventListener('click', addRowAll);
        const deleteRowAllBtn = document.getElementById('delete-row-all-btn');
        deleteRowAllBtn.addEventListener('click', deleteRowAll);
        const addColumnBtn = document.getElementById('add-column-btn');
        addColumnBtn.addEventListener('click', addColumn);
        const deleteColumnBtn = document.getElementById('delete-column-btn');
        deleteColumnBtn.addEventListener('click', deleteColumn);
    }

    /* Form Data Inputs, Submit, & Reset */

    /* A submit event listener is added to the form. When the user clicks on the submit button,the data is first validated with validateData() to see if all data input table cells contain appropriate numerical values or aren't empty. Also checks to see if all data labels for Y (and Y2) are unique. If this returns true, submitData() is carried out. If validateData() returns false, error classes and messages are added to the appropriate data input table cells and data labels that didn't pass validation. Focus event listeners are then added to all data inputs so that when the user focuses on a table cell with an error to fix it, the error display disappears. Focus Event listeners are also added to all data labels. When a user focuses on any data label to change it, the error display disappears on all of them. A reset event listener is also added to the form. When the user clicks on the reset button, it restores the form to its initialized state and unloads the data used in the chart live preview. */

    function setForm() {
        const chartEditorForm = document.getElementById('chart-editor-form');
        chartEditorForm.addEventListener('submit', e => {
            e.preventDefault();
            if (validateData()) {
                submitData();
                console.log('Data submit successful!');
            } else {
                const allDataInputs = document.getElementsByClassName('data-input');
                for (let dataInput of allDataInputs) {
                    dataInput.addEventListener('focus', () => {
                        dataInput.value = '';
                        dataInput.classList.remove('is-invalid');
                        dataInput.nextElementSibling.classList.add('hidden');
                    });
                }
                const allTableSeriesLabelYInputs = document.getElementsByClassName('table-series-label-y-input');
                const allTableSeriesLabelY2Inputs = document.getElementsByClassName('table-series-label-y2-input');
                for (let tableSeriesLabelYInput of allTableSeriesLabelYInputs) {
                    tableSeriesLabelYInput.addEventListener('focus', () => {
                        tableSeriesLabelYInput.value = '';
                        for (let labelYInput of allTableSeriesLabelYInputs){
                            labelYInput.classList.remove('is-invalid');
                            labelYInput.nextElementSibling.classList.add('hidden');
                        }
                        for (let labelY2Input of allTableSeriesLabelY2Inputs){
                            if (!labelY2Input.classList.contains('hidden')){
                                labelY2Input.classList.remove('is-invalid');
                                labelY2Input.nextElementSibling.classList.add('hidden');
                            }
                        }
                    });
                }

                for (let tableSeriesLabelY2Input of allTableSeriesLabelY2Inputs) {
                    if (!tableSeriesLabelY2Input.classList.contains('hidden')){
                        tableSeriesLabelY2Input.addEventListener('focus', () => {
                            tableSeriesLabelY2Input.value = '';
                            for (let labelY2Input of allTableSeriesLabelY2Inputs){
                                labelY2Input.classList.remove('is-invalid');
                                labelY2Input.nextElementSibling.classList.add('hidden');
                            }
                            for (let labelYInput of allTableSeriesLabelYInputs){
                                labelYInput.classList.remove('is-invalid');
                                labelYInput.nextElementSibling.classList.add('hidden');
                            }
                        });
                    }
                }
                console.log('Data submit failed!');
            }
        });
        chartEditorForm.addEventListener('reset', () => {
            chartEditorForm.reset();
            resetTableSeries();
            resetRows();
            deleteColumn();
            chart.unload();
        });
    }

    /* Rows */

    /* Clones first row in the table body and removes any validation error checks that may have been copied on the data inputs. Assigns appropriate value classes to each data input (x, y, or y2). Finally, inserts cloned row into appropriate place where user clicked to add a new row and resets the row number count. Also adds event listeners to the buttons in this newly added row. */

    function addRow() {
        const parentTableBody = this.parentNode.parentNode.parentNode;
        let cloneRow = parentTableBody.rows[0].cloneNode(true);
        const dataInputs = cloneRow.getElementsByClassName('data-input');
        for (let dataInput of dataInputs) {
            dataInput.value = '';
            dataInput.classList.remove('is-invalid');
            dataInput.nextElementSibling.classList.add('hidden');
        }
        if (dataInputs[0]) {
            dataInputs[0].classList.add('x-values');
            dataInputs[0].classList.remove('y-values');
            dataInputs[0].classList.remove('y2-values');
        }
        if (dataInputs[1]) {
            dataInputs[1].classList.add('y-values');
            dataInputs[1].classList.remove('x-values');
            dataInputs[1].classList.remove('y2-values');
        }
        if (dataInputs[2]) {
            dataInputs[2].classList.add('y2-values');
            dataInputs[2].classList.remove('x-values');
            dataInputs[2].classList.remove('y-values');
        }
        const currentRow = this.parentNode.parentNode;
        parentTableBody.insertBefore(cloneRow, currentRow.nextSibling);
        setRowNumbers();
        setRowBtnEvents();
    }

    /* Works similarly to addRow(). Loops through all table series to add a cloned row to each table series. The new cloned row is also always added to the end of each table. */

    function addRowAll() {
        const tableSeries = document.getElementsByClassName('table-series');
        for (let i = 0; i < tableSeries.length; i++) {
            const tableBody = tableSeries[i].getElementsByClassName('table-body')[0];
            let cloneRow = tableBody.rows[0].cloneNode(true);
            const dataInputs = cloneRow.getElementsByClassName('data-input');
            for (let dataInput of dataInputs) {
                dataInput.value = '';
                dataInput.classList.remove('is-invalid');
                dataInput.nextElementSibling.classList.add('hidden');
            }
            if (dataInputs[0]) {
                dataInputs[0].classList.add('x-values');
                dataInputs[0].classList.remove('y-values');
                dataInputs[0].classList.remove('y2-values');
            }
            if (dataInputs[1]) {
                dataInputs[1].classList.add('y-values');
                dataInputs[1].classList.remove('x-values');
                dataInputs[1].classList.remove('y2-values');
            }
            if (dataInputs[2]) {
                dataInputs[2].classList.add('y2-values');
                dataInputs[2].classList.remove('x-values');
                dataInputs[2].classList.remove('y-values');
            }
            tableBody.appendChild(cloneRow);
            setRowNumbers();
            setRowBtnEvents();
        }
    }

    /* Deletes row that the delete button is attached to when user clicks on it. Prevents user from deleting all rows with rowCount. One row is always ensured to remain since user can only delete when rowCount is greater than one. Row numbers are also reset after each delete since user can remove rows at any position. */

    function deleteRow() {
        const parentTableBody = this.parentNode.parentNode.parentNode;
        let rowCount = parentTableBody.rows.length;
        if (rowCount > 1) {
            const currentRow = this.parentNode.parentNode;
            parentTableBody.removeChild(currentRow);
            rowCount--;
            setRowNumbers();
        } else {
            return;
        }
    }

    /* Works similarly to deleteRow(). Loops through all table series and removes last row of each table. Prevents user from deleting all rows in table series. One row is always ensured to remain in each table series since user can only delete when lastRowIndex is greater than zero. */

    function deleteRowAll() {
        const tableSeries = document.getElementsByClassName('table-series');
        for (let i = 0; i < tableSeries.length; i++) {
            const tableBody = tableSeries[i].getElementsByClassName('table-body')[0];
            const lastRowIndex = tableBody.rows.length - 1;
            if (lastRowIndex > 0) {
                const lastRow = tableBody.rows[lastRowIndex];
                tableBody.removeChild(lastRow);
            } else {
                return;
            }
        }
    }

    /* Used as part of resetting the entire form when user clicks on reset button. Deletes rows in all table series except for the first row. */

    function resetRows() {
        const tableSeries = document.getElementsByClassName('table-series');
        for (let i = 0; i < tableSeries.length; i++) {
            const tableBody = tableSeries[i].getElementsByClassName('table-body')[0];
            for (j = 1; j < tableBody.rows.length;) {
                tableBody.deleteRow(j);
            }
        }
    }

    /* Columns */

    /* Defines a global columnCount to be used with all column functions. addColumn() and deleteColumn() allow user to add or delete an optional Y2 value used in C3.js charts. */

    let columnCount = 0;

    /* User can only add one additional column (Y2 column) when columnCount is zero. This prevents user from adding an infinite amount of columns. If user can create Y2 column, gets Y2 data label inputs and Y2 axis label input. Hidden visibility is removed from these so users can input their own labels for Y2 Axis and Y2 Axis table series data. Y2 Axis label also becomes visible in chart live preview. New Y2 column header is then created for each table series with appropriate attributes and is inserted after Y Column heading. New table body cells are also created with appropriate HTML and inserted after the Y table body cells. */

    function addColumn() {
        if (columnCount > 0) {
            return;
        }
        if (columnCount === 0) {
            const tableSeries = document.getElementsByClassName('table-series');
            const tableSeriesLabelY2Inputs = document.getElementsByClassName('table-series-label-y2-input');
            const y2Axis = document.getElementById('y2-axis');
            y2Axis.classList.remove('hidden');
            for (let tableSeriesLabelY2Input of tableSeriesLabelY2Inputs) {
                tableSeriesLabelY2Input.classList.remove('hidden');
                tableSeriesLabelY2Input.classList.add('mt-3');
            }
            chart.axis.show_y2(true);
            for (let i = 0; i < tableSeries.length; i++) {
                const tableHead = tableSeries[i].getElementsByClassName('table-head')[0];
                const yColumn = tableSeries[i].getElementsByClassName('y-column')[0];
                const newColumn = document.createElement('th');
                newColumn.className = 'text-center';
                newColumn.scope = 'col';
                tableHead.rows[0].insertBefore(newColumn, yColumn.nextSibling);
                newColumn.textContent = 'Y2 Values';
                newColumn.classList.add('y2-column');
                newColumn.textContent = `Y2 Values`;
                const tableBody = tableSeries[i].getElementsByClassName('table-body')[0];
                for (let j = 0; j < tableBody.rows.length; j++) {
                    const newCell = tableBody.rows[j].insertCell(columnCount + 3);
                    newCell.innerHTML = `<td class="text-center"><input type="text" class="form-control data-input y2-values"><div class="hidden invalid-feedback">Please enter a numerical data value.</div></td>`;
                }
            }
            columnCount++;
        } else {
            return;
        }
    }

    /* Works the exact opposite as addColumn(). Prevents user from deleting more than just Y2 column with columnCount check. If user can delete Y2 column, adds hidden visibility to Y2 axis label and data label inputs and restores their values to original defaults. Y2 Axis also disappears in chart live preview. Table header and table body cells for Y2 columns are deleted from each table series. */

    function deleteColumn() {
        if (columnCount > 0) {
            const tableSeries = document.getElementsByClassName('table-series');
            const tableSeriesLabelY2Inputs = document.getElementsByClassName('table-series-label-y2-input');
            const y2Axis = document.getElementById('y2-axis');
            const y2AxisLabel = document.getElementById('y2-axis-label');
            y2AxisLabel.value = '';
            y2Axis.classList.add('hidden');
            chart.axis.labels({
                y2: 'Y2 Axis Label'
            });
            chart.axis.show_y2(false);  
            for (let tableSeriesLabelY2Input of tableSeriesLabelY2Inputs) {
                tableSeriesLabelY2Input.classList.add('hidden');
                tableSeriesLabelY2Input.classList.remove('my-3');
            }
            for (let i = 0; i < tableSeries.length; i++) {
                tableSeries[i].getElementsByClassName('y2-column')[0].remove();
                const tableBody = tableSeries[i].getElementsByClassName('table-body')[0];
                for (let j = 0; j < tableBody.rows.length; j++) {
                    tableBody.rows[j].deleteCell(columnCount + 2);
                }
            }
            columnCount--;
        } else {
            return;
        }
    }

    /* Table Series */

    /* Creates clone of last table series. Resets values in each data input cell and data label to be empty. Also removes any validation error classes & hides error messages in case they existed on the table series that was cloned from. Finally, inserts newly cloned table series after the last table series. */

    function addTableSeries() {
        const tables = document.getElementsByClassName('table-div');
        const lastTable = tables[tables.length - 1];
        const cloneTable = lastTable.cloneNode(true);
        const dataInputs = cloneTable.getElementsByClassName('data-input');
        for (let dataInput of dataInputs) {
            dataInput.value = '';
            dataInput.classList.remove('is-invalid');
            dataInput.nextElementSibling.classList.add('hidden');
        }
        const tableSeriesLabelYInput = cloneTable.getElementsByClassName('table-series-label-y-input')[0];
        tableSeriesLabelYInput.value = '';
        tableSeriesLabelYInput.classList.remove('is-invalid');
        tableSeriesLabelYInput.nextElementSibling.classList.add('hidden');
        const tableSeriesLabelY2Inputs = cloneTable.getElementsByClassName('table-series-label-y2-input');
        if (tableSeriesLabelY2Inputs.length > 0){
            const tableSeriesLabelY2Input = tableSeriesLabelY2Inputs[0];
            tableSeriesLabelY2Input.value = '';
            tableSeriesLabelY2Input.classList.remove('is-invalid');
            tableSeriesLabelY2Input.nextElementSibling.classList.add('hidden');
        }
        lastTable.parentNode.insertBefore(cloneTable, lastTable.nextSibling);
        setTableSeries();
    }

    /* Finds the last table and deletes it. Prevents user from deleting all tables by ensuring one remains with tables.length > 1 check. */

    function deleteTableSeries() {
        const tables = document.getElementsByClassName('table-div');
        const lastTable = tables[tables.length - 1];
        if (tables.length > 1) {
            lastTable.parentNode.removeChild(lastTable);
        } else {
            return;
        }
    }

    /* Used as part of resetting the entire form when user clicks on reset button. Deletes all table series except for the first one. */

    function resetTableSeries() {
        const tables = document.getElementsByClassName('table-div');
        for(let i = 1; i < tables.length;) {
            tables[i].parentNode.removeChild(tables[i]);
        }
    }

    /* Sets the label (count number) for each table series. Also sets each table series id and calls other functions to set row numbers and row button events.  */

    function setTableSeries() {
        const tables = document.getElementsByClassName('table-div');
        for (let i = 0; i < tables.length; i++) {
            const tableSeriesLabel = tables[i].getElementsByClassName('table-series-label')[0];
            tableSeriesLabel.for = `table-series-${i + 1}`;
            tableSeriesLabel.innerHTML = `<strong>Series ${i + 1}</strong>`;
            const tableSeries = tables[i].getElementsByClassName('table-series')[0];
            tableSeries.id = `table-series-${i + 1}`;
            setRowNumbers();
            setRowBtnEvents();
        }
    }

    /* Loops through all tables and for each table, loops through each row and sets its row number. */

    function setRowNumbers() {
        const tables = document.getElementsByClassName('table-div');
        for (let i = 0; i < tables.length; i++) {
            const tableRowNumbers = tables[i].getElementsByClassName('table-row-number');
            for (let j = 0; j < tableRowNumbers.length; j++) {
                tableRowNumbers[j].textContent = `${j + 1}`;
            }
        }
    }

    /* Finds add row and delete row buttons in all tables. Adds click event listeners with appropriate addRow or deleteRow function to each button. */

    function setRowBtnEvents() {
        const addRowBtns = document.getElementsByClassName('add-row-btn');
        const deleteRowBtns = document.getElementsByClassName('delete-row-btn');
        for (let deleteRowBtn of deleteRowBtns) {
            deleteRowBtn.addEventListener('click', deleteRow);
        }
        for (let addRowBtn of addRowBtns) {
            addRowBtn.addEventListener('click', addRow);
        }
    }

    /* Validate Data */

    /* When user submits form, all user input in table body cells is checked. First, error classes and messages are reset on table body cells in case user has already tried to submit data. Then, each column's values (x, y, and y2) are checked to see if they are an empty string or are a numerical value. If not, is-invalid class is added to the data input field and an error message is revealed to the user in that table cell. Data labels for Y (and Y2) are also checked to be unique since C3.js will not display data labels correctly if any match. Like the table body cells, error classes and messages are first reset to original state. All Y (and Y2) data labels are looped through and stored in tableSeriesLabelsArray. Blank values are given a unique label as a default. A set is created from tableSeriesLabelsArray and its size is compared to the array's length to determine any repeated values. If there are repeated values, is-invalid class is added to all Y (and Y2) data labels and error messages are revealed to the user. The errorCount incrementally increases for each error that is found. If at the end the errorCount is greater than zero (meaning errors were found), the function returns false and data submission fails. Otherwise, if errorCount is zero, the function returns true and submitData() is carried out. */

    function validateData() {
        const invalidFeedbacks = document.getElementsByClassName('invalid-feedback');
        for (let invalidFeedback of invalidFeedbacks) {
            invalidFeedback.classList.add('hidden');
        }
        const invalidDataInputs = document.getElementsByClassName('data-input');
        for (let invalidDataInput of invalidDataInputs){
            invalidDataInput.classList.remove('is-invalid');
        }

        const invalidTableSeriesLabelYInputs = document.getElementsByClassName('table-series-label-y-input');
        for (let invalidTableSeriesLabelYInput of invalidTableSeriesLabelYInputs){
            invalidTableSeriesLabelYInput.classList.remove('is-invalid');
        }

        const invalidTableSeriesLabelY2Inputs = document.getElementsByClassName('table-series-label-y-input');
        for (let invalidTableSeriesLabelY2Input of invalidTableSeriesLabelY2Inputs){
            invalidTableSeriesLabelY2Input.classList.remove('is-invalid');
        }

        let errorCount = 0;
        let tableSeriesNumber = 0;
        const tableSeries = document.getElementsByClassName('table-series');
        for (let i = 0; i < tableSeries.length; i++) {
            const xValues = tableSeries[i].getElementsByClassName('x-values');
            if (xValues) {
                for (let xValue of xValues) {
                    if (xValue.value === '' || isNaN(xValue.value) === true) {
                        xValue.classList.add('is-invalid');
                        xValue.nextElementSibling.classList.remove('hidden');
                        errorCount++;
                    }
                }
            }
            const yValues = tableSeries[i].getElementsByClassName('y-values');
            if (yValues) {
                for (let yValue of yValues) {
                    if (yValue.value === '' || isNaN(yValue.value) === true) {
                        yValue.classList.add('is-invalid');
                        yValue.nextElementSibling.classList.remove('hidden');
                        errorCount++;
                    }
                }
            }
            const y2Values = tableSeries[i].getElementsByClassName('y2-values');
            if (y2Values) {
                for (let y2Value of y2Values) {
                    if (y2Value.value === '' || isNaN(y2Value.value) === true) {
                        y2Value.classList.add('is-invalid');
                        y2Value.nextSibling.classList.remove('hidden');
                        errorCount++;
                    }
                }
            }
            const tableSeriesLabelYInputs = document.getElementsByClassName('table-series-label-y-input');
            const tableSeriesLabelsArray = [];
            for (let tableSeriesLabelYInput of tableSeriesLabelYInputs){
                if (tableSeriesLabelYInput.value === '') {
                    tableSeriesLabelsArray.push(`Series ${tableSeriesNumber + 1}-Y`);
                    tableSeriesNumber++;
                } else {
                    tableSeriesLabelsArray.push(tableSeriesLabelYInput.value);
                }
            }
            const tableSeriesLabelY2Inputs = document.getElementsByClassName('table-series-label-y2-input');
            for (let tableSeriesLabelY2Input of tableSeriesLabelY2Inputs){
                if (!tableSeriesLabelY2Input.classList.contains('hidden')){
                    if (tableSeriesLabelY2Input.value === '') {
                        tableSeriesLabelsArray.push(`Series ${tableSeriesNumber + 1}-Y2`);
                        tableSeriesNumber++;
                    } else {
                        tableSeriesLabelsArray.push(tableSeriesLabelY2Input.value);
                    }
                }
            }

            const tableSeriesLabelsSet = new Set(tableSeriesLabelsArray);
            if (tableSeriesLabelsArray.length !== tableSeriesLabelsSet.size) {
                for (let tableSeriesLabelYInput of tableSeriesLabelYInputs){
                    tableSeriesLabelYInput.classList.add('is-invalid');
                    tableSeriesLabelYInput.nextElementSibling.classList.remove('hidden');
                }
                for (let tableSeriesLabelY2Input of tableSeriesLabelY2Inputs){
                    if (!tableSeriesLabelY2Input.classList.contains('hidden')){
                        tableSeriesLabelY2Input.classList.add('is-invalid');
                        tableSeriesLabelY2Input.nextElementSibling.classList.remove('hidden');
                    }
                }
                errorCount++;
            }
        }
        if (errorCount > 0) {
            return false;
        }
        return true;
    }

    /* Submit Data */

    /* If validateData() is successful, submitData() runs. First, Y (and Y2 if it exists) data labels of all table series are stored in an Y (or Y2) labels array. If user did not provide a Y (or Y2) data label for a table series, a default value of "Series #-Y(2)" is used and pushed to the labels array. Next, each table series is looped through and all x, y, (and y2) values are gathered and stored in an array for that table series. The first value in the Y (or Y2) array is set to the values stored in the Y (or Y2) labels array. For x values, "Series #-X" is used as the first value. Each array created for x, y, (and y2) values for that table series is then stored in another array. These arrays (allXArrays, allYArrays, (and allY2Arrays)) contain all the x, y, (and y2) arrays created from each table series. These arrays will be looped through and values from it pushed into the tableSeriesData array, which will be used by C3.js to generate the chart. In addition, objects named xs and axes are created and data from these arrays are pushed as key/value pairs. C3.js uses an xs property to determine the values that make up the x axis (by default it just uses index for this) and it uses an axes property to use the y2 axis with the data. Finally, the old chart's data is unloaded and tableSeriesData, xs (and axes if Y2 is used) are passed into the chart's load method, causing it to reload with this new data. */

    function submitData() {
        let tableSeriesNumber = 0;
        const tableSeriesLabelYInputs = document.getElementsByClassName('table-series-label-y-input');
        let tableSeriesLabelYInputsArray = Array.from(tableSeriesLabelYInputs);
        let tableSeriesLabelsY = [];
        tableSeriesLabelYInputsArray.forEach(label => {
            if (label.value === '') {
                tableSeriesLabelsY.push(`Series ${tableSeriesNumber + 1}-Y`);
            } else {
                tableSeriesLabelsY.push(label.value);
            }
            tableSeriesNumber++;
        });

        tableSeriesNumber = 0;
        const tableSeriesLabelY2Inputs = document.getElementsByClassName('table-series-label-y2-input');
        let tableSeriesLabelY2InputsArray = Array.from(tableSeriesLabelY2Inputs);
        let tableSeriesLabelsY2 = [];
        tableSeriesLabelY2InputsArray.forEach(label => {
            if (label.value === '') {
                tableSeriesLabelsY2.push(`Series ${tableSeriesNumber + 1}-Y2`);
            } else {
                tableSeriesLabelsY2.push(label.value);
            }
            tableSeriesNumber++;
        });

        const tableSeries = document.getElementsByClassName('table-series');
        tableSeriesArray = Array.from(tableSeries);
        let count = 0;
        let allXArrays = [];
        let allYArrays = [];
        let allY2Arrays = [];
        tableSeriesArray.forEach(table => {
            const xValues = table.getElementsByClassName('x-values');
            let xValuesArray = Array.from(xValues);
            xValuesArray = xValuesArray.map(x => {
                return parseInt(x.value);
            });
            xValuesArray.unshift(`Series ${count + 1}-X`);
            allXArrays.push(xValuesArray);

            const yValues = table.getElementsByClassName('y-values');
            let yValuesArray = Array.from(yValues);
            yValuesArray = yValuesArray.map(y => {
                return parseInt(y.value);
            });
            yValuesArray.unshift(tableSeriesLabelsY[count]);
            allYArrays.push(yValuesArray);

            const y2Values = table.getElementsByClassName('y2-values');
            if(y2Values){
                let y2ValuesArray = Array.from(y2Values);
                y2ValuesArray = y2ValuesArray.map(y2 => {
                    return parseInt(y2.value);
                });
                if (y2ValuesArray.length !== 0) {
                    y2ValuesArray.unshift(tableSeriesLabelsY2[count]);
                    allY2Arrays.push(y2ValuesArray);
                }
            }
            count++;
        });

        let tableSeriesData = [];
        let xs = {};
        let axes = {};
        for (let i = 0; i < allXArrays.length; i++) {
            tableSeriesData.push(allXArrays[i]);
            tableSeriesData.push(allYArrays[i]);
            xs[allYArrays[i][0]] = allXArrays[i][0];
            if (allY2Arrays.length !== 0) {
                axes[allY2Arrays[i][0]] = 'y2';
                xs[allY2Arrays[i][0]] = allXArrays[i][0];
                tableSeriesData.push(allY2Arrays[i]);
            }
        }

        if (allY2Arrays.length !== 0) {
            chart.unload({
                done: function() {
                    chart.load({
                        xs: xs,
                        columns: tableSeriesData,
                        axes: axes
                    });
                }
            });       
        } else {
            chart.unload({
                done: function() {
                    chart.load({
                        xs: xs,
                        columns: tableSeriesData,
                        axes: axes
                    });
                }
            });       
        }
    }

    /* Initializes Chart Editor */
    
    setChartTypes();
    setTitlesAndLabels();
    setColorThemes();
    setTableSeries();
    setForm();
    setFormButtons();
});