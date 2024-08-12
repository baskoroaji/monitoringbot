function groupDataByDay(data) {
    return data.reduce((acc, item) => {
        const date = moment(item.updatetime * 1000).utcOffset(8); // JST Offset
        const hour = date.hour();
        
        if (hour >= 6 && hour <= 23) {
            const dateString = date.format('YYYY-MM-DD');
            
            if (!acc[dateString]) {
                acc[dateString] = [];
            }
            acc[dateString].push(item);
        }
        
        return acc;
    }, {});
}