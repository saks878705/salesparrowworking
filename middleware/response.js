exports.response = (response, type, message, data, code) => {
    var message1 = "";
    switch (type) {
        case 'success':
            message1 = message || 'success';
            return response.status(code || 200).json({ message: message1, status: true, results: data });
            break;
        case 'fail':
            message1 = message || 'Some error has occured, please try again later';
            return response.status(code || 403).json({ message: message1, status: false, results: data });
            break;
    }
    ;

}