use crate::*;
use solana_program::{msg, program_error::ProgramError};

#[derive(Debug)]
pub enum PayersInstruction {
    CreatePDAWithSystemAccNotFeePayer {},
    CreatePDAWithOwnedAcc {},
}

impl PayersInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        msg!("Unpacking instruction...");

        let (tag, _) = input
            .split_first()
            .ok_or(errors::PayersError::InvalidInstruction)?;

        Ok(match tag {
            0 => Self::CreatePDAWithSystemAccNotFeePayer {},
            1 => Self::CreatePDAWithOwnedAcc {},
            _ => return Err(errors::PayersError::InvalidInstruction.into()),
        })
    }
}
