exports.successResponse = function (res, msg) {
	var data = {
		status: 1,
		message: msg
	};
	return res.status(200).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
	var resData = {
		status: 1,
		message: msg,
		data: data
	};
	return res.status(200).json(resData);
};

// custom by me
exports.successResponseWithDataAndTotal = function (res, msg, data, total) {
	var resData = {
		status: 1,
		message: msg,
		total: total,
		data: data
	};
	return res.status(200).json(resData);
};
exports.successResponseWithDataAndAllTotals = function (res, msg, data, totalMint, totalBurn, totalTransfer) {
	var resData = {
		status: 1,
		message: msg,
		totalMint: totalMint,
		totalBurn: totalBurn,
		totalTransfer: totalTransfer,
		data: data
	};
	return res.status(200).json(resData);
};

//////////////////////////////////////////////////

exports.ErrorResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(500).json(data);
};

exports.notFoundResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(404).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
	var resData = {
		status: 0,
		message: msg,
		data: data
	};
	return res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(401).json(data);
};
