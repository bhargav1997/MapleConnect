const Marketplace = require('../models/Marketplace');

// @desc    Create marketplace listing
// @route   POST /api/marketplace
// @access  Private
exports.createListing = async (req, res, next) => {
  try {
    // Add seller to req.body
    req.body.seller = req.user.id;
    
    const listing = await Marketplace.create(req.body);
    
    res.status(201).json({
      success: true,
      data: listing
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all marketplace listings
// @route   GET /api/marketplace
// @access  Private
exports.getListings = async (req, res, next) => {
  try {
    // Build query
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Marketplace.find(JSON.parse(queryStr)).populate('seller', 'name profileImage');
    
    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Marketplace.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const listings = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: listings.length,
      pagination,
      data: listings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single marketplace listing
// @route   GET /api/marketplace/:id
// @access  Private
exports.getListing = async (req, res, next) => {
  try {
    const listing = await Marketplace.findById(req.params.id).populate(
      'seller',
      'name profileImage'
    );
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update marketplace listing
// @route   PUT /api/marketplace/:id
// @access  Private
exports.updateListing = async (req, res, next) => {
  try {
    let listing = await Marketplace.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }
    
    // Make sure user is listing seller
    if (listing.seller.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this listing'
      });
    }
    
    listing = await Marketplace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('seller', 'name profileImage');
    
    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete marketplace listing
// @route   DELETE /api/marketplace/:id
// @access  Private
exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Marketplace.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }
    
    // Make sure user is listing seller
    if (listing.seller.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this listing'
      });
    }
    
    await listing.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update listing status
// @route   PUT /api/marketplace/:id/status
// @access  Private
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !['available', 'pending', 'sold'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid status (available, pending, sold)'
      });
    }
    
    let listing = await Marketplace.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }
    
    // Make sure user is listing seller
    if (listing.seller.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this listing'
      });
    }
    
    listing = await Marketplace.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    ).populate('seller', 'name profileImage');
    
    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get listings by seller
// @route   GET /api/users/:userId/marketplace
// @access  Private
exports.getSellerListings = async (req, res, next) => {
  try {
    const listings = await Marketplace.find({ seller: req.params.userId })
      .populate('seller', 'name profileImage')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (err) {
    next(err);
  }
};
