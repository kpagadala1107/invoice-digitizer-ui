// Utility functions for formatting messages and data

/**
 * Format agent response based on content type
 */
export const formatAgentResponse = (content, type = 'text') => {
  if (!content) return 'No response';

  switch (type) {
    case 'document':
      return formatDocumentResponse(content);
    case 'validation':
      return formatValidationResponse(content);
    case 'search':
      return formatSearchResponse(content);
    case 'error':
      return formatErrorResponse(content);
    default:
      return formatTextResponse(content);
  }
};

/**
 * Format text response (handle markdown, JSON, etc.)
 */
const formatTextResponse = (content) => {
  if (typeof content === 'object') {
    return JSON.stringify(content, null, 2);
  }
  return String(content);
};

/**
 * Format document processing response
 */
const formatDocumentResponse = (content) => {
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      return formatDocumentData(parsed);
    } catch {
      return content;
    }
  }
  return formatDocumentData(content);
};

const formatDocumentData = (data) => {
  if (!data) return 'No data extracted';

  const sections = [];

  if (data.extractedData || data.data) {
    const extracted = data.extractedData || data.data;
    sections.push('**Extracted Data:**\n```json\n' + JSON.stringify(extracted, null, 2) + '\n```');
  }

  if (data.validation) {
    sections.push(formatValidationData(data.validation));
  }

  if (data.message) {
    sections.push(data.message);
  }

  return sections.length > 0 ? sections.join('\n\n') : JSON.stringify(data, null, 2);
};

/**
 * Format validation response
 */
const formatValidationResponse = (content) => {
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      return formatValidationData(parsed);
    } catch {
      return content;
    }
  }
  return formatValidationData(content);
};

const formatValidationData = (validation) => {
  if (!validation) return 'No validation data';

  const lines = ['**Validation Results:**'];

  if (validation.isValid !== undefined) {
    lines.push(`Status: ${validation.isValid ? '✅ Valid' : '❌ Invalid'}`);
  }

  if (validation.errors && validation.errors.length > 0) {
    lines.push('\n**Errors:**');
    validation.errors.forEach((error, idx) => {
      lines.push(`${idx + 1}. ${error}`);
    });
  }

  if (validation.warnings && validation.warnings.length > 0) {
    lines.push('\n**Warnings:**');
    validation.warnings.forEach((warning, idx) => {
      lines.push(`${idx + 1}. ${warning}`);
    });
  }

  if (validation.fields) {
    lines.push('\n**Field Validation:**');
    Object.entries(validation.fields).forEach(([field, status]) => {
      const icon = status === 'valid' ? '✅' : status === 'invalid' ? '❌' : '⚠️';
      lines.push(`${icon} ${field}: ${status}`);
    });
  }

  return lines.join('\n');
};

/**
 * Format search response
 */
const formatSearchResponse = (content) => {
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      return formatSearchData(parsed);
    } catch {
      return content;
    }
  }
  return formatSearchData(content);
};

const formatSearchData = (data) => {
  if (!data) return 'No results found';

  if (data.results && Array.isArray(data.results)) {
    if (data.results.length === 0) {
      return 'No results found';
    }

    const lines = [`**Found ${data.results.length} result(s):**\n`];
    data.results.forEach((result, idx) => {
      lines.push(`**${idx + 1}.** ${JSON.stringify(result, null, 2)}`);
    });
    return lines.join('\n');
  }

  return JSON.stringify(data, null, 2);
};

/**
 * Format error response
 */
const formatErrorResponse = (content) => {
  if (typeof content === 'object' && content.message) {
    return `❌ Error: ${content.message}`;
  }
  return `❌ ${String(content)}`;
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format timestamp
 */
export const formatTimestamp = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Detect if content is JSON
 */
export const isJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Parse and beautify JSON if possible
 */
export const beautifyJSON = (content) => {
  if (typeof content === 'object') {
    return JSON.stringify(content, null, 2);
  }
  
  if (isJSON(content)) {
    return JSON.stringify(JSON.parse(content), null, 2);
  }
  
  return content;
};

/**
 * Extract code blocks from markdown
 */
export const extractCodeBlocks = (text) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    });
  }
  
  return blocks;
};

/**
 * Truncate long text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get file icon based on file type
 */
export const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  const icons = {
    pdf: '📄',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    txt: '📃',
    json: '📋',
    xml: '📋',
  };
  return icons[ext] || '📎';
};
