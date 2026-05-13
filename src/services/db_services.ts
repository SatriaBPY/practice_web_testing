import { db } from "config/db";


export async function forceDeleteUser(userId: string) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    
    await connection.query(
      `
      DELETE FROM invoice_items
      WHERE invoice_id IN (
        SELECT id
        FROM invoices
        WHERE user_id = ?
      )
      `,
      [userId]
    );

    
    await connection.query(
      `
      DELETE FROM payments
      WHERE invoice_id IN (
        SELECT id
        FROM invoices
        WHERE user_id = ?
      )
      `,
      [userId]
    );

   
    await connection.query(
      `
      DELETE FROM invoices
      WHERE user_id = ?
      `,
      [userId]
    );

    
    await connection.query(
      `
      DELETE FROM users
      WHERE id = ?
      `,
      [userId]
    );

    await connection.commit();

    console.log(`[DB] Force delete success for user ${userId}`);
  } catch (error) {
    await connection.rollback();

    console.error("[DB] Force delete failed:", error);

    throw error;
  } finally {
    connection.release();
  }
}