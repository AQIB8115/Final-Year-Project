const PcModel = require('../Models/pc');
const PcRequest = require('../Models/pcreservation')


// Create a new PC
exports.createPc = async (req, res) => {
    try {
        const { pc_Number, status } = req.body;

        if (!pc_Number || pc_Number === null) {
            return res.status(400).json({ error: 'PC_Number is required and cannot be null' });
        }
        const existingPc = await PcModel.findOne({ pc_Number });
        if (existingPc) {
            return res.status(400).json({ error: 'PC_Number already exists' });
        }
        const newPc = new PcModel({ pc_Number, status });
        await newPc.save();
        res.status(201).json({ message: 'PC successfully created' });
    } catch (error) {
        console.error('Error creating PC:', error);
        res.status(400).json({ error: 'Unable to create PC', details: error.message });
    }
};

// Get all PCs
exports.getAllPcs = async (req, res) => {
    try {
        const pcs = await PcModel.find();
        res.status(200).json(pcs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getUserViewPcs = async (req, res) => {
    try {
        console.log('API called: /getUserViewPcs');

        const pcs = await PcModel.find();
        console.log('PCs fetched from DB:', pcs);

        if (!pcs || pcs.length === 0) {
            console.log('No PCs found in the database.');
        }

        const userViewData = pcs.map(pc => ({
            id: pc._id,
            PC_Number: pc.pc_Number,
            status: pc.status,
            reserved: false
        }));

        console.log('Formatted Data for Response:', userViewData);

        res.status(200).json(userViewData);
    } catch (error) {
        console.error('Error in getUserViewPcs:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get a specific PC by ID
exports.getPcById = async (req, res) => {
    try {
        const pc = await PcModel.findById(req.params.id);
        if (!pc) {
            return res.status(404).json({ error: 'PC not found' });
        }
        res.status(200).json(pc);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch PC', details: error });
    }
};

// Update a PC
exports.updatePc = async (req, res) => {
    try {
        const updatedPc = await PcModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPc) {
            return res.status(404).json({ error: 'PC not found' });
        }
        res.status(200).json({ message: 'PC successfully updated', pc: updatedPc });
    } catch (error) {
        res.status(400).json({ error: 'Unable to update PC', details: error });
    }
};

// Delete a PC
exports.deletePc = async (req, res) => {
    try {
        const deletedPc = await PcModel.findByIdAndDelete(req.params.id);
        if (!deletedPc) {
            return res.status(404).json({ error: 'PC not found' });
        }
        res.status(200).json({ message: 'PC successfully deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete PC', details: error });
    }
};

exports.reservePC = async (req, res) => {
    const { id } = req.params;
    const { userId, reservedTime } = req.body;

    try {
        // Find the PC by ID
        const pc = await PcModel.findById(id);
        if (!pc) {
            return res.status(404).json({ message: "PC not found" });
        }

        // Create a PC reservation request
        const pcRequest = new PcRequest({
            user: userId,
            pc: pc._id,
            status: 'reserved',
        });
        await pcRequest.save();

        // Update the PC reserved status
        pc.reserved = true;
        pc.reservedTime = reservedTime;
        await pc.save();

        res.status(200).json({ message: "PC reserved successfully", pc });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getReservedPCs = async (req, res) => {
    try {
        // Find all reserved PCs from PcModel
        const reservedPCs = await PcModel.find({ reserved: true });

        if (!reservedPCs || reservedPCs.length === 0) {
            return res.status(404).json({ message: 'No reserved PCs found.' });
        }

        // Find related PcRequest records and populate user details
        const reservedPCDetails = await Promise.all(
            reservedPCs.map(async (pc) => {
                console.log("PC:", pc); // Log the PC being processed

                const request = await PcRequest.findOne({ pc: pc._id, status: 'reserved' })
                    .populate('user', 'username email')
                    .populate('pc', 'pc_Number');

                console.log("Request details:", request); // Log the populated request

                return {
                    pcNumber: pc.pc_Number,
                    reservedBy: request?.user ? request.user.username : null,
                    reservedUntil: request?.reservedUntil || null, // Include reservedUntil from PcRequest
                };
            })
        );

        res.status(200).json({ reservedPCs: reservedPCDetails });
    } catch (error) {
        console.error('Error fetching reserved PCs:', error);
        res.status(500).json({ message: 'Error fetching reserved PCs', error: error.message });
    }
};