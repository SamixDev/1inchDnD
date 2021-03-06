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
exports.successResponseWithDataAndTotalSupply = function (res, msg, data, total_supply) {
	var resData = {
		status: 1,
		message: msg,
		total_supply: total_supply,
		data: data
	};
	return res.status(200).json(resData);
};

exports.successResponseWithDataAndTotal = function (res, msg, data, total) {
	var resData = {
		status: 1,
		message: msg,
		total: total,
		data: data
	};
	return res.status(200).json(resData);
};

exports.successResponseWithDataAndAllTotalsAndCounts = function (res, msg, data, count,
	totalMint, totalBurn, totalTransfer,
	totalMintCount, totalBurnCount, totalTransferCount) {
	var resData = {
		status: 1,
		message: msg,
		totalMint: totalMint,
		totalBurn: totalBurn,
		totalTransfer: totalTransfer,
		totalMintCount: totalMintCount,
		totalBurnCount: totalBurnCount,
		totalTransferCount: totalTransferCount,
		data: data,
		count: count
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
